# Data Classification Using AI

**Project 2 - DecodeLabs Artificial Intelligence Internship**

## Project Overview

This project builds a robust machine learning classification pipeline to predict customer order statuses based on a synthetic e-commerce dataset. It demonstrates end-to-end data science practices including exploratory data analysis, advanced feature engineering, hyperparameter tuning, cross-validation, and model evaluation.

---

## Features

### Machine Learning Pipeline

- Data loading and automated preprocessing
- Handling of missing values and consolidation of rare categories
- Feature encoding using Label Encoding
- Numerical feature scaling using StandardScaler
- Automated feature selection based on Random Forest feature importances
- Stratified K-Fold cross-validation for robust training
- Hyperparameter tuning using GridSearchCV
- Automated comparison and selection between Decision Tree and Random Forest classifiers
- Comprehensive metric reporting including Precision, Recall, and F1-Score

---

## Dataset

- **Name:** Online-Store-Orders.xlsx
- **Target Variable:** OrderStatus (5 Classes: Cancelled, Delivered, Pending, Returned, Shipped)
- **Size:** 1,200 rows
- **Location:** dataset/Online-Store-Orders.xlsx

---

## Technologies Used

- Python 3
- Pandas
- NumPy
- Scikit-Learn
- Matplotlib
- Seaborn

---

## Project Structure

```text
Task-02-Data-Classification-Using-AI/
│
├── dataset/
│   └── Online-Store-Orders.xlsx
├── results/
│   ├── best_model_accuracy.txt
│   ├── final_model_report.txt
│   ├── confusion_matrix_final.png
│   └── model_comparison_bar_chart.png
├── screenshots/
├── main.py
├── requirements.txt
└── README.md
```

---

## Installation and Usage

### Setup

1. Ensure Python 3.x is installed.
2. Navigate to the project folder.
3. Install the required dependencies:

```bash
pip install -r requirements.txt
```

### Execution

1. Open a terminal in the project directory.
2. Run the main pipeline script:

```bash
python main.py
```

The script will output feature importance rankings, cross-validation metrics, final test accuracy, and a sample prediction demo directly in your terminal. Visual artifacts will automatically be saved into the `results/` folder.

---

## Results and Key Insights

- **Feature Engineering:** Noisy identifiers and highly collinear features were dropped. Categorical features were processed using LabelEncoder to prevent dimensionality explosion. Random Forest selected the top 7 most influential features.
- **Model Optimization:** Models utilized balanced class weights and were rigorously evaluated using StratifiedKFold (5 splits) integrated with GridSearchCV to find optimal hyperparameter configurations.
- **Dataset Nature:** Mathematical correlation tests confirmed the highest feature-to-target correlation is only ~0.06. Because the 5 target classes are perfectly uniformly distributed and possess no structural relationship to the features, the pipeline hits the mathematical accuracy ceiling of ~20%. The models correctly avoid artificial data leakage and perform exactly at the theoretical limit for randomized noise.

---

## Screenshots

### Terminal Execution Output

*(A screenshot of the terminal after running python main.py)*
<!-- ![Terminal Execution](screenshots/terminal_output.png) -->

### Model Comparison

*(Bar chart comparing Decision Tree and Random Forest accuracy)*
![Model Comparison](results/model_comparison_bar_chart.png)

### Confusion Matrix

*(Heatmap showing actual vs predicted classifications)*
![Confusion Matrix](results/confusion_matrix_final.png)

---

## Learning Outcomes

This project helped strengthen the following concepts:

- Exploratory Data Analysis (EDA)
- Feature engineering and selection
- Dealing with high-cardinality and rare categorical variables
- Implementing Cross-Validation (StratifiedKFold)
- Hyperparameter tuning with GridSearchCV
- Preventing data leakage
- Interpreting machine learning metrics beyond basic accuracy

---

## Future Enhancements

Potential improvements include:

- Testing gradient boosting algorithms (XGBoost, LightGBM)
- Deploying the final model via a Flask or FastAPI backend
- Integrating an interactive web dashboard for real-time order classification

---

## Author

**DecodeLabs Artificial Intelligence Internship Participant**

DecodeLabs Artificial Intelligence Internship – Project 2
