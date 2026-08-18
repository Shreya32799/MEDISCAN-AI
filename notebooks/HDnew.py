# %% [markdown]
# # ❤️ MediScan-AI Heart Disease Prediction Model
# 
# ## 1. Import Libraries
# 
# The required Python libraries are imported for data manipulation, visualization, model training, evaluation, and saving the trained model.

# %%
# Data Manipulation
import numpy as np
import pandas as pd

# Data Visualization
import matplotlib.pyplot as plt
import seaborn as sns

# Train-Test Split
from sklearn.model_selection import train_test_split

# Machine Learning Models
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC

# Model Evaluation
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    classification_report,
    ConfusionMatrixDisplay,
    roc_curve,
    roc_auc_score
)

# Hyperparameter Tuning
from sklearn.model_selection import GridSearchCV

# Save Model
import joblib

# Ignore Warnings
import warnings
warnings.filterwarnings("ignore")

# %% [markdown]
# ## 2. Load Dataset
# 
# The Heart Disease dataset is loaded into a Pandas DataFrame for further exploration and preprocessing.
# 
# This dataset contains various clinical parameters used to predict the presence of heart disease.

# %%
heart_df = pd.read_csv("../data/raw/heart_disease.csv")

heart_df.head()

# %%
heart_df.shape

# %%
heart_df.info()

# %% [markdown]
# ### Observation
# 
# - The dataset has multiple clinical features related to heart disease.
# - Each row represents one patient record.
# - The dataset will be explored further to identify missing values, data types, and class distribution.

# %% [markdown]
# ## 3. Explore Dataset
# 
# In this step, the dataset is explored to understand its structure, dimensions, data types, statistical summary, missing values, duplicate records, and target class distribution before preprocessing.

# %%
heart_df.head()

# %%
heart_df.tail()

# %%
heart_df.shape

# %%
heart_df.info()

# %%
heart_df.describe().T

# %%
heart_df.isnull().sum()

# %%
heart_df.duplicated().sum()

# %%
heart_df["num"].value_counts()

# %%
heart_df["num"].value_counts().plot(
    kind="bar",
    xlabel="Heart Disease Class",
    ylabel="Count",
    title="Heart Disease Dataset Distribution"
)

plt.show()

# %% [markdown]
# ### Observation
# 
# - The dataset contains clinical features related to heart disease prediction.
# - Statistical analysis provides information about the distribution of numerical variables.
# - Missing values and duplicate records are identified for cleaning.
# - The target variable (`num`) represents the presence and severity of heart disease.
# - The class distribution helps identify whether the dataset is balanced or imbalanced.

# %% [markdown]
# ## 4. Data Cleaning
# 
# In this step, missing values and unnecessary columns are handled to prepare the dataset for machine learning.
# 
# The goal is to improve data quality before model training.

# %%
heart_df.isnull().sum()

# %%
heart_df = heart_df.drop(columns=["id"])

# %%
heart_df["trestbps"] = heart_df["trestbps"].fillna(heart_df["trestbps"].median())

heart_df["chol"] = heart_df["chol"].fillna(heart_df["chol"].median())

heart_df["fbs"] = heart_df["fbs"].fillna(heart_df["fbs"].mode()[0])

heart_df["restecg"] = heart_df["restecg"].fillna(heart_df["restecg"].mode()[0])

heart_df["thalch"] = heart_df["thalch"].fillna(heart_df["thalch"].median())

heart_df["exang"] = heart_df["exang"].fillna(heart_df["exang"].mode()[0])

heart_df["oldpeak"] = heart_df["oldpeak"].fillna(heart_df["oldpeak"].median())

heart_df["slope"] = heart_df["slope"].fillna(heart_df["slope"].mode()[0])

# %%
heart_df = heart_df.drop(columns=["ca", "thal"])

# %%
heart_df.isnull().sum()

# %%
heart_df.duplicated().sum()

# %%
heart_df = heart_df.drop_duplicates()

# %%
heart_df.shape

# %% [markdown]
# ### Observation
# 
# - Missing values were successfully handled using median and mode imputation.
# - Columns with excessive missing values (`ca` and `thal`) were removed.
# - Duplicate records were removed.
# - The dataset is now clean and ready for Exploratory Data Analysis (EDA).

# %% [markdown]
# ## 5. Exploratory Data Analysis (EDA)
# 
# Exploratory Data Analysis (EDA) is performed to understand the distribution of features, identify patterns, detect relationships between variables, and analyze factors associated with heart disease.

# %%
heart_df["num"].value_counts().plot(
    kind="bar",
    figsize=(6,4),
    color=["skyblue","salmon","orange","green","purple"]
)

plt.title("Heart Disease Distribution")
plt.xlabel("Heart Disease Class")
plt.ylabel("Count")
plt.show()

# %%
plt.figure(figsize=(7,4))

sns.histplot(heart_df["age"], bins=20, kde=True)

plt.title("Age Distribution")

plt.show()

# %%
plt.figure(figsize=(6,4))

sns.countplot(
    data=heart_df,
    x="sex",
    hue="num"
)

plt.title("Gender vs Heart Disease")

plt.xlabel("Sex (0 = Female, 1 = Male)")

plt.show()

# %%
plt.figure(figsize=(7,4))

sns.countplot(
    data=heart_df,
    x="cp",
    hue="num"
)

plt.title("Chest Pain Type vs Heart Disease")

plt.show()

# %%
plt.figure(figsize=(7,4))

sns.histplot(
    heart_df["chol"],
    bins=25,
    kde=True
)

plt.title("Cholesterol Distribution")

plt.xlabel("Cholesterol (mg/dL)")

plt.show()

# %%
plt.figure(figsize=(7,4))

sns.histplot(
    heart_df["trestbps"],
    bins=20,
    kde=True
)

plt.title("Resting Blood Pressure Distribution")

plt.xlabel("Blood Pressure (mmHg)")

plt.show()

# %%
plt.figure(figsize=(12,8))

sns.heatmap(
    heart_df.corr(numeric_only=True),
    annot=True,
    cmap="coolwarm",
    fmt=".2f"
)

plt.title("Correlation Heatmap")

plt.show()

# %% [markdown]
# ### Observation
# 
# - The dataset contains patients from different age groups.
# - Heart disease occurrence varies across gender and chest pain types.
# - Cholesterol and resting blood pressure show varying distributions among patients.
# - The correlation heatmap highlights relationships between clinical features and the target variable, helping identify important predictors for model training.

# %% [markdown]
# ## 6. Data Preprocessing
# 
# In this step, the target variable is converted into a binary classification problem, the input features and target variable are separated, and feature scaling is performed where required.

# %%
heart_df["num"] = heart_df["num"].apply(lambda x: 0 if x == 0 else 1)

# %%
X = heart_df.drop("num", axis=1)
y = heart_df["num"]

# %%
X = pd.get_dummies(X, drop_first=True)

# %%
feature_columns = X.columns

# %%
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()

X_scaled = scaler.fit_transform(X)

# %%
import joblib

joblib.dump(scaler, "../models/heart_scaler.pkl")

print("✅ Heart Disease Scaler Saved")

# %%
print(X.shape)

# %%
X_scaled[:5]

# %% [markdown]
# ## 7. Train-Test Split

# %%
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X_scaled,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# %%
print("Training Data :", X_train.shape)
print("Testing Data  :", X_test.shape)

# %% [markdown]
# The dataset was divided into training and testing sets using an 80:20 ratio. Stratified sampling was applied to preserve the class distribution in both subsets, ensuring reliable model evaluation and reducing sampling bias.

# %% [markdown]
# ## 8. Model Training

# %%
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC

# %%
models = {
    "Logistic Regression": LogisticRegression(max_iter=1000),
    "KNN": KNeighborsClassifier(),
    "Decision Tree": DecisionTreeClassifier(random_state=42),
    "Random Forest": RandomForestClassifier(random_state=42),
    "SVM": SVC()
}

for name, model in models.items():
    model.fit(X_train, y_train)

print("✅ All models trained successfully!")

# %%
list(models.keys())

# %% [markdown]
# Five machine learning classification algorithms were trained using the training dataset:
# 
# *Logistic Regression*
# *K-Nearest Neighbors (KNN)*
# *Decision Tree*
# *Random Forest*
# *Support Vector Machine (SVM)*
# 
# These models were selected to compare their performance and identify the most suitable algorithm for heart disease prediction.

# %% [markdown]
# ## 9. Model Evaluation
# 

# %%
from sklearn.metrics import accuracy_score

results = []

for name, model in models.items():

    y_pred = model.predict(X_test)

    accuracy = accuracy_score(y_test, y_pred)

    results.append([name, accuracy])

results_df = pd.DataFrame(
    results,
    columns=["Model", "Accuracy"]
)

results_df.sort_values(
    by="Accuracy",
    ascending=False
)

# %%
plt.figure(figsize=(8,5))

plt.bar(
    results_df["Model"],
    results_df["Accuracy"]
)

plt.title("Model Accuracy Comparison")

plt.ylabel("Accuracy")

plt.xticks(rotation=20)

plt.show()

# %%
best_model = results_df.sort_values(
    by="Accuracy",
    ascending=False
).iloc[0]

print(best_model)

# %% [markdown]
# ### Observation
# 
# All five machine learning models were evaluated on the testing dataset.
# 
# The model with the highest accuracy was selected as the final prediction model for the Heart Disease Prediction System.

# %% [markdown]
# ## 10. Hyperparameter Tuning
# 

# %%
from sklearn.model_selection import GridSearchCV

# %%
param_grid = {
    "n_neighbors": [3, 5, 7, 9, 11, 13],
    "weights": ["uniform", "distance"],
    "metric": ["euclidean", "manhattan"]
}

grid = GridSearchCV(
    KNeighborsClassifier(),
    param_grid,
    cv=5,
    scoring="accuracy",
    n_jobs=-1
)

grid.fit(X_train, y_train)

# %%
print("Best Parameters :", grid.best_params_)
print("Best CV Accuracy :", grid.best_score_)

# %%
from sklearn.metrics import accuracy_score

best_model = grid.best_estimator_

y_pred = best_model.predict(X_test)

final_accuracy = accuracy_score(y_test, y_pred)

print("Final Test Accuracy :", final_accuracy)

# %% [markdown]
# The K-Nearest Neighbors classifier was further optimized using GridSearchCV.
# 
# Different values of K, weighting methods, and distance metrics were tested using 5-fold cross-validation.
# 
# The best-performing parameter combination was selected as the final model.

# %% [markdown]
# ## 11. Feature Importance

# %%
from sklearn.inspection import permutation_importance

# %%
best_model = grid.best_estimator_

result = permutation_importance(
    best_model,
    X_test,
    y_test,
    n_repeats=10,
    random_state=42,
    scoring="accuracy"
)

# %%
importance_df = pd.DataFrame({
    "Feature": X.columns,
    "Importance": result.importances_mean
})

importance_df = importance_df.sort_values(
    by="Importance",
    ascending=False
)

importance_df

# %%
plt.figure(figsize=(10,6))

plt.barh(
    importance_df["Feature"],
    importance_df["Importance"]
)

plt.title("Feature Importance")

plt.xlabel("Importance")

plt.gca().invert_yaxis()

plt.show()

# %% [markdown]
# ### Feature Importance
# 
# Since K-Nearest Neighbors does not provide built-in feature importance, Permutation Importance was used.
# 
# This method measures how much the model accuracy decreases when the values of a feature are randomly shuffled.
# 
# Features causing the largest decrease in accuracy are considered the most important for predicting heart disease.

# %% [markdown]
# ## 12. Save Best Model

# %%
import joblib

# %%
joblib.dump(best_model, "../models/heart_model.pkl")

print("✅ Heart Disease model saved successfully!")

# %%
feature_columns = X.columns
joblib.dump(feature_columns, "../models/heart_columns.pkl")

# %%
loaded_model = joblib.load("../models/heart_model.pkl")

print(type(loaded_model))

# %% [markdown]
# ## Model Saving
# 
# The best-performing machine learning model was saved using the Joblib library.
# 
# Saving the trained model allows it to be reused in the MediScan-AI Streamlit application without retraining, improving deployment efficiency and reducing prediction time.

# %% [markdown]
# ## 13. Conclusion

# %% [markdown]
# # 13. Final Conclusion
# 
# ## Project Summary
# 
# This project successfully developed a machine learning model for predicting the likelihood of heart disease using the UCI Heart Disease Dataset.
# 
# The dataset was explored, cleaned, preprocessed, and analyzed through Exploratory Data Analysis (EDA). Multiple machine learning algorithms were trained and evaluated to identify the most suitable model for heart disease prediction.
# 
# The following models were compared:
# 
# - Logistic Regression
# - K-Nearest Neighbors (KNN)
# - Decision Tree
# - Random Forest
# - Support Vector Machine (SVM)
# 
# Among these models, **K-Nearest Neighbors (KNN)** achieved the highest prediction accuracy on the testing dataset.
# 
# ## Final Model
# 
# - **Algorithm:** K-Nearest Neighbors (KNN)
# - **Best Parameters:**
#   - Metric: Euclidean
#   - Number of Neighbors: 13
#   - Weights: Distance
# - **Final Test Accuracy:** **83.70%**
# 
# Permutation Importance was used to identify the most influential features contributing to heart disease prediction.
# 
# The final trained model was saved using the Joblib library and is ready to be integrated into the MediScan-AI Streamlit application for real-time predictions.
# 
# ## Future Improvements
# 
# - Train on a larger and more diverse dataset.
# - Perform advanced feature engineering.
# - Explore deep learning models.
# - Improve model explainability using SHAP or LIME.
# - Deploy the model on cloud platforms for real-world healthcare applications.
# 
# ## Conclusion
# 
# The developed Heart Disease Prediction model demonstrates that machine learning can effectively assist in the early identification of patients at risk of heart disease.
# 
# Although this system is intended for educational and decision-support purposes, it showcases how artificial intelligence can support healthcare professionals by providing fast, consistent, and data-driven predictions.


