"""
Task 02: Data Classification Using AI - Final Pipeline (Maximum Performance)
Objective: Build a machine learning classification model using the provided dataset.
Dataset: Online-Store-Orders.xlsx

Author: DecodeLabs Artificial Intelligence Internship Participant
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import os
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score, GridSearchCV
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report, precision_recall_fscore_support

# Ensure the results directory exists
os.makedirs('results', exist_ok=True)

def load_data(filepath):
    df = pd.read_excel(filepath)
    return df

def handle_rare_categories(df, column, threshold=0.05):
    """Groups rare categories (frequency < threshold) into 'Other'."""
    freq = df[column].value_counts(normalize=True)
    rare_cats = freq[freq < threshold].index
    df[column] = df[column].apply(lambda x: 'Other' if x in rare_cats else x)
    return df

def preprocess_data(df):
    df_processed = df.copy()
    
    # 1. Missing Values
    df_processed['CouponCode'] = df_processed['CouponCode'].fillna('No Coupon')
    
    # 2. Data Cleaning Improvement (Rare Categories)
    for col in ['Product', 'ReferralSource', 'CouponCode', 'PaymentMethod']:
        df_processed = handle_rare_categories(df_processed, col, threshold=0.05)
    
    # 3. Drop Identifiers and Noisy Features
    cols_to_drop = ['OrderID', 'CustomerID', 'TrackingNumber', 'ShippingAddress', 'TotalPrice', 'Date']
    df_processed.drop(columns=cols_to_drop, inplace=True, errors='ignore')
    
    # 4. Encoding Optimization (Label Encoding instead of One-Hot)
    le_target = LabelEncoder()
    df_processed['OrderStatus'] = le_target.fit_transform(df_processed['OrderStatus'])
    
    cat_features = ['Product', 'PaymentMethod', 'CouponCode', 'ReferralSource']
    for col in cat_features:
        le = LabelEncoder()
        df_processed[col] = le.fit_transform(df_processed[col].astype(str))
        
    # 5. Scale Numerical Features
    scaler = StandardScaler()
    num_features = ['Quantity', 'UnitPrice', 'ItemsInCart']
    df_processed[num_features] = scaler.fit_transform(df_processed[num_features])
    
    y = df_processed['OrderStatus']
    X = df_processed.drop(columns=['OrderStatus'])
    target_names = le_target.classes_
    
    return X, y, target_names

def select_features(X_train, y_train, X_test):
    """
    Evaluates feature importance using an initial Random Forest 
    and keeps only the top contributing features.
    """
    print("\n--- Feature Selection ---")
    rf_initial = RandomForestClassifier(random_state=42, n_estimators=100, class_weight='balanced', n_jobs=-1)
    rf_initial.fit(X_train, y_train)
    
    importances = pd.Series(rf_initial.feature_importances_, index=X_train.columns)
    print("Feature Importances:")
    print(importances.sort_values(ascending=False))
    
    # Keep features that contribute at least something meaningful (> 0.05)
    top_features = importances[importances > 0.05].index.tolist()
    
    # Ensure we keep at least the top 3 features if all are low
    if len(top_features) < 3:
        top_features = importances.nlargest(3).index.tolist()
        
    print(f"\nSelected Top Features ({len(top_features)}): {top_features}")
    
    return X_train[top_features], X_test[top_features]

def train_model(X_train, y_train):
    """
    Trains models with GridSearchCV, using StratifiedKFold.
    """
    models = {}
    cv_scores = {}
    
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    
    print("\n--- Training Models (with GridSearchCV & StratifiedKFold) ---")
    
    # Decision Tree
    dt_param_grid = {'max_depth': [5, 10, 20]}
    dt_grid = GridSearchCV(DecisionTreeClassifier(random_state=42, class_weight='balanced'), dt_param_grid, cv=cv, n_jobs=-1, scoring='accuracy')
    dt_grid.fit(X_train, y_train)
    models['Decision Tree'] = dt_grid.best_estimator_
    cv_scores['Decision Tree'] = dt_grid.best_score_
    
    # Random Forest
    rf_param_grid = {'max_depth': [10, 15, 20], 'min_samples_split': [5]}
    rf = RandomForestClassifier(random_state=42, n_estimators=200, class_weight='balanced', n_jobs=-1)
    rf_grid = GridSearchCV(rf, rf_param_grid, cv=cv, n_jobs=-1, scoring='accuracy')
    rf_grid.fit(X_train, y_train)
    models['Random Forest'] = rf_grid.best_estimator_
    cv_scores['Random Forest'] = rf_grid.best_score_
    
    print(f"Decision Tree CV Accuracy: {cv_scores['Decision Tree']:.4f} (Params: {dt_grid.best_params_})")
    print(f"Random Forest CV Accuracy: {cv_scores['Random Forest']:.4f} (Params: {rf_grid.best_params_})")
    
    return models, cv_scores

def evaluate_model(models, X_test, y_test, target_names, output_dir='results'):
    """
    Evaluates trained models on the test set, saving comparisons.
    """
    results = {}
    metrics_report = {}
    best_acc = 0
    best_model_name = None
    best_model = None
    
    for name, model in models.items():
        y_pred = model.predict(X_test)
        acc = accuracy_score(y_test, y_pred)
        precision, recall, f1, _ = precision_recall_fscore_support(y_test, y_pred, average='weighted', zero_division=0)
        
        results[name] = acc
        metrics_report[name] = {'Precision': precision, 'Recall': recall, 'F1-Score': f1}
        
        if acc > best_acc:
            best_acc = acc
            best_model_name = name
            best_model = model
            
    if results['Decision Tree'] == results['Random Forest']:
        best_model_name = 'Random Forest'
        best_model = models['Random Forest']
        best_acc = results['Random Forest']

    # Visual Summary
    plt.figure(figsize=(8, 5))
    names = list(results.keys())
    accuracies = list(results.values())
    sns.barplot(x=names, y=accuracies, hue=names, palette='Set2', legend=False)
    plt.title('Final Test Accuracy Comparison')
    plt.ylabel('Accuracy')
    plt.ylim(0, 1.0)
    for i, acc in enumerate(accuracies):
        plt.text(i, acc + 0.02, f'{acc:.4f}', ha='center', va='bottom', fontweight='bold')
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'model_comparison_bar_chart.png'))
    plt.close()
    
    # Evaluate best model thoroughly and save final artifacts
    y_pred_best = best_model.predict(X_test)
    
    with open(os.path.join(output_dir, 'best_model_accuracy.txt'), 'w') as f:
        f.write(f"Best Model: {best_model_name}\n")
        f.write(f"Test Accuracy: {best_acc:.4f}\n")
        
    report = classification_report(y_test, y_pred_best, target_names=target_names)
    with open(os.path.join(output_dir, 'final_model_report.txt'), 'w') as f:
        f.write(f"Final Classification Report ({best_model_name})\n")
        f.write("="*40 + "\n")
        f.write(report)
        
    cm = confusion_matrix(y_test, y_pred_best)
    plt.figure(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Greens', xticklabels=target_names, yticklabels=target_names)
    plt.title(f'Final Confusion Matrix ({best_model_name})')
    plt.ylabel('True Label')
    plt.xlabel('Predicted Label')
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'confusion_matrix_final.png'))
    plt.close()
    
    return best_model, best_model_name, best_acc, metrics_report

def main():
    """Main execution pipeline."""
    # 1. Load Data
    dataset_path = 'dataset/Online-Store-Orders.xlsx'
    df = load_data(dataset_path)
    total_rows = df.shape[0]
    
    old_accuracy = 0.2125
    
    # 2. Preprocess Data
    X, y, target_names = preprocess_data(df)
    
    # 3. Train-Test Split (STRATIFIED)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    # 4. Feature Improvement
    X_train, X_test = select_features(X_train, y_train, X_test)
    features_count = X_train.shape[1]
    
    # 5. Train Models with CV
    models, cv_scores = train_model(X_train, y_train)
    
    # 6. Evaluate and Select Best Model
    best_model, best_name, test_acc, metrics_report = evaluate_model(models, X_test, y_test, target_names)
    
    # 7. Final Project Summary Output
    print("\n==================================================")
    print("FINAL PROJECT SUMMARY (MAXIMUM PERFORMANCE PHASE)")
    print("==================================================")
    print(f"Dataset Size:          {total_rows} rows")
    print(f"Features Retained:     {features_count}")
    
    print("\n--- Validation & Test Metrics ---")
    print(f"Cross-Validation Accuracy ({best_name}): {cv_scores[best_name]:.4f}")
    print(f"Final Test Accuracy ({best_name}):       {test_acc:.4f}")
    
    print("\n--- Detailed Metrics (Best Model) ---")
    print(f"Precision: {metrics_report[best_name]['Precision']:.4f}")
    print(f"Recall:    {metrics_report[best_name]['Recall']:.4f}")
    print(f"F1-Score:  {metrics_report[best_name]['F1-Score']:.4f}")
    
    print("\n--- Before vs After ---")
    print(f"Old Accuracy:          {old_accuracy:.4f}")
    print(f"New Best Accuracy:     {test_acc:.4f}")
    print(f"Best Model Selected:   {best_name}")
    print("==================================================\n")
    
if __name__ == "__main__":
    main()
