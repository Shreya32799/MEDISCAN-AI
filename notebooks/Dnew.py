# %% [markdown]
# # MediScan-AI Diabetes Prediction Model
# 
# ## 1. Import Libraries

# %%
import warnings
warnings.filterwarnings("ignore")

import numpy as np
import pandas as pd

import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import (
    train_test_split,
    GridSearchCV,
    cross_val_score
)

from sklearn.preprocessing import StandardScaler

from sklearn.pipeline import Pipeline

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    classification_report
)

from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import (
    RandomForestClassifier,
    GradientBoostingClassifier
)

from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier

import joblib

# %% [markdown]
# ## 2. Load Dataset

# %%
import pandas as pd #Imports the Pandas library (shortened as pd) to work with datasets and tables.

diabetes_df = pd.read_csv("../data/raw/diabetes.csv")   #Reads the diabetes.csv file and stores it as a DataFrame named diabetes_df.

diabetes_df.head()     #Displays the first 5 rows of the dataset to quickly verify that the data has been loaded correctly.

# %%
diabetes_df.shape  #Returns the number of rows and columns in the dataset as a tuple (rows, columns).

# %%
diabetes_df.info()   #Displays a summary of the dataset, including column names, data types, non-null values, and memory usage.

# %% [markdown]
# ## 3. Explore Dataset

# %%
diabetes_df.head()      #Displays the first 5 rows of the dataset for a quick preview of the data.

# %%
diabetes_df.tail()      #Displays the last 5 rows of the dataset for a quick preview of the ending records.

# %%
diabetes_df.describe().T         #Generates summary statistics (count, mean, standard deviation, minimum, maximum, and quartiles) for all numerical columns, displayed in a transposed format.

# %%
diabetes_df.isnull().sum()          #Returns the total number of missing (null) values in each column of the dataset.

# %%
diabetes_df.duplicated().sum()         #Returns the total number of duplicate rows present in the dataset.

# %%
diabetes_df["Outcome"].value_counts()           #Returns the count of each unique value in the Outcome column (e.g., diabetic and non-diabetic cases).

# %%
import matplotlib.pyplot as plt                        # Imports Matplotlib (pyplot) to create visualizations.Creates a bar chart showing the number of diabetic (1) and non-diabetic (0) patients, with labeled axes and a title.  plt.show() displays the graph.

diabetes_df["Outcome"].value_counts().plot(
    kind="bar",
    xlabel="Outcome",
    ylabel="Count",
    title="Diabetes Dataset Distribution"
)

plt.show()

# %% [markdown]
# ## 4. Data Cleaning

# %%
cols = ["Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI"]

for col in cols:
    print(f"{col}: {(diabetes_df[col] == 0).sum()} zero values")

# %%
cols = ["Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI"]

for col in cols:
    diabetes_df[col] = diabetes_df[col].replace(0, diabetes_df[col].median())

# %%
for col in cols:
    print(f"{col}: {(diabetes_df[col] == 0).sum()} zero values")

# %% [markdown]
# ## 5. Exploratory Data Analysis (EDA)

# %%
import matplotlib.pyplot as plt
import seaborn as sns

plt.figure(figsize=(10,8))

sns.heatmap(
    diabetes_df.corr(),
    annot=True,
    cmap="coolwarm",
    fmt=".2f"
)

plt.title("Correlation Heatmap")
plt.show()

# %%
diabetes_df.hist(figsize=(15,10), bins=20)

plt.tight_layout()

plt.show()

# %%
plt.figure(figsize=(15,10))

for i, column in enumerate(diabetes_df.columns[:-1]):
    plt.subplot(2,4,i+1)
    sns.boxplot(y=diabetes_df[column])
    plt.title(column)

plt.tight_layout()

plt.show()

# %%
diabetes_df.groupby("Outcome").mean().T

# %% [markdown]
# ## 6. Data Preprocessing

# %%
# Separate Features and Target

X = diabetes_df.drop("Outcome", axis=1)
y = diabetes_df["Outcome"]

print("Features Shape:", X.shape)
print("Target Shape:", y.shape)

# %%
from sklearn.model_selection import train_test_split

# %%
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

print("Training Set:", X_train.shape)
print("Testing Set :", X_test.shape)

# %%
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()

X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

print("Scaling Completed Successfully!")

# %%
import joblib

joblib.dump(scaler, "../models/diabetes_scaler.pkl")

print("✅ Diabetes Scaler Saved")

# %% [markdown]
# ## 7. Train-Test Split

# %%
from sklearn.model_selection import train_test_split

X = diabetes_df.drop("Outcome", axis=1)
y = diabetes_df["Outcome"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

print("Training Features :", X_train.shape)
print("Testing Features  :", X_test.shape)
print("Training Labels   :", y_train.shape)
print("Testing Labels    :", y_test.shape)

# %% [markdown]
# ### Observation
# 
# - The dataset was divided into training (80%) and testing (20%) sets.
# - Stratified sampling was used to preserve the class distribution.
# - Random state was fixed to ensure reproducible results.

# %% [markdown]
# ## 8. Model Training
# 
# In this step, multiple machine learning algorithms are trained and compared.
# 
# The following algorithms are used:
# 
# - Logistic Regression
# - K-Nearest Neighbors (KNN)
# - Decision Tree
# - Random Forest
# - Support Vector Machine (SVM)
# 
# The best-performing model will be selected based on prediction accuracy.

# %%
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC

from sklearn.metrics import accuracy_score

# %%
lr_model = LogisticRegression(max_iter=1000)

lr_model.fit(X_train_scaled, y_train)

lr_pred = lr_model.predict(X_test_scaled)

lr_acc = accuracy_score(y_test, lr_pred)

print("Logistic Regression Accuracy :", round(lr_acc*100,2),"%")

# %% [markdown]
# ### Observation
# 
# Logistic Regression was trained as the baseline classification model.

# %%
knn_model = KNeighborsClassifier(n_neighbors=5)

knn_model.fit(X_train_scaled, y_train)

knn_pred = knn_model.predict(X_test_scaled)

knn_acc = accuracy_score(y_test, knn_pred)

print("KNN Accuracy :", round(knn_acc*100,2),"%")

# %% [markdown]
# ### Observation
# 
# KNN predicts the class based on the nearest neighboring samples.

# %%
dt_model = DecisionTreeClassifier(random_state=42)

dt_model.fit(X_train,y_train)

dt_pred = dt_model.predict(X_test)

dt_acc = accuracy_score(y_test,dt_pred)

print("Decision Tree Accuracy :",round(dt_acc*100,2),"%")

# %% [markdown]
# ### Observation
# 
# Decision Tree creates decision rules to classify patients.

# %%
rf_model = RandomForestClassifier(random_state=42)

rf_model.fit(X_train,y_train)

rf_pred = rf_model.predict(X_test)

rf_acc = accuracy_score(y_test,rf_pred)

print("Random Forest Accuracy :",round(rf_acc*100,2),"%")

# %% [markdown]
# ### Observation
# 
# Random Forest combines multiple decision trees to improve prediction accuracy and reduce overfitting.

# %%
svm_model = SVC()

svm_model.fit(X_train_scaled,y_train)

svm_pred = svm_model.predict(X_test_scaled)

svm_acc = accuracy_score(y_test,svm_pred)

print("SVM Accuracy :",round(svm_acc*100,2),"%")

# %% [markdown]
# ### Observation
# 
# Support Vector Machine attempts to find the optimal boundary between diabetic and non-diabetic patients.

# %%
results = pd.DataFrame({
    "Model":[
        "Logistic Regression",
        "KNN",
        "Decision Tree",
        "Random Forest",
        "SVM"
    ],

    "Accuracy":[
        lr_acc,
        knn_acc,
        dt_acc,
        rf_acc,
        svm_acc
    ]
})

results = results.sort_values(
    by="Accuracy",
    ascending=False
)

results

# %% [markdown]
# ### Observation
# 
# Among all the trained models, **Random Forest** achieved the highest accuracy and was selected as the best-performing model for further optimization.

# %% [markdown]
# ## 9. Model Evaluation
# 
# The selected Random Forest model is evaluated using various classification metrics to measure its predictive performance.
# 
# Evaluation Metrics:
# 
# - Accuracy Score
# - Confusion Matrix
# - Classification Report
# - ROC Curve
# - ROC-AUC Score

# %%
from sklearn.metrics import (
    confusion_matrix,
    classification_report,
    ConfusionMatrixDisplay,
    roc_curve,
    roc_auc_score
)

import matplotlib.pyplot as plt

# %%
print(f"Accuracy : {rf_acc*100:.2f}%")

# %% [markdown]
# ### Observation
# 
# The Random Forest model achieved an accuracy of approximately **75.97%** on the testing dataset.

# %%
print(classification_report(y_test, rf_pred))

# %% [markdown]
# ### Observation
# 
# The classification report provides Precision, Recall, F1-Score, and Support for both diabetic and non-diabetic classes.

# %%
cm = confusion_matrix(y_test, rf_pred)

disp = ConfusionMatrixDisplay(
    confusion_matrix=cm,
    display_labels=["Non-Diabetic", "Diabetic"]
)

disp.plot(cmap="Blues")

plt.title("Confusion Matrix")

plt.show()

# %% [markdown]
# ### Observation
# 
# The confusion matrix shows the number of correct and incorrect predictions made by the Random Forest model.

# %%
rf_probability = rf_model.predict_proba(X_test)[:,1]

fpr, tpr, thresholds = roc_curve(y_test, rf_probability)

plt.figure(figsize=(6,5))

plt.plot(fpr, tpr, label="Random Forest")

plt.plot([0,1],[0,1],"--")

plt.xlabel("False Positive Rate")

plt.ylabel("True Positive Rate")

plt.title("ROC Curve")

plt.legend()

plt.show()

# %%
auc = roc_auc_score(y_test, rf_probability)

print("ROC-AUC Score :", round(auc,3))

# %% [markdown]
# ### Observation
# 
# A higher ROC-AUC score indicates better discrimination between diabetic and non-diabetic patients. Values closer to **1.0** represent excellent model performance.

# %% [markdown]
# ## 10. Hyperparameter Tuning
# 
# Hyperparameter tuning is performed using GridSearchCV to find the best combination of Random Forest parameters.
# 
# The objective is to improve the model's performance by searching across multiple parameter combinations using 5-fold cross-validation.

# %%
from sklearn.model_selection import GridSearchCV

# %%
param_grid = {
    "n_estimators": [100, 200, 300],
    "max_depth": [5, 10, 15, None],
    "min_samples_split": [2, 5, 10],
    "min_samples_leaf": [1, 2, 4],
    "criterion": ["gini", "entropy"]
}

# %%
grid_search = GridSearchCV(
    estimator=RandomForestClassifier(random_state=42),
    param_grid=param_grid,
    cv=5,
    scoring="accuracy",
    n_jobs=-1,
    verbose=1
)

grid_search.fit(X_train, y_train)

# %%
print("Best Parameters:")
print(grid_search.best_params_)

# %%
print("Best Cross Validation Accuracy:")
print(round(grid_search.best_score_ * 100, 2), "%")

# %%
best_rf = grid_search.best_estimator_

best_predictions = best_rf.predict(X_test)

best_accuracy = accuracy_score(y_test, best_predictions)

print("Test Accuracy:", round(best_accuracy * 100, 2), "%")

# %%
comparison = pd.DataFrame({
    "Model": [
        "Random Forest (Before Tuning)",
        "Random Forest (After Tuning)"
    ],
    "Accuracy": [
        rf_acc,
        best_accuracy
    ]
})

comparison

# %% [markdown]
# ### Observation
# 
# GridSearchCV identified the optimal combination of hyperparameters for the Random Forest model.
# 
# The tuned model achieved improved performance compared to the default Random Forest model and was selected as the final model for deployment in the MediScan-AI application.

# %% [markdown]
# ## 11. Feature Importance
# 
# Feature importance helps identify which input variables have the greatest influence on the model's predictions.
# 
# This improves model interpretability and can be used to explain predictions to users in the MediScan-AI application.

# %%
import matplotlib.pyplot as plt
import pandas as pd

feature_importance = pd.DataFrame({
    "Feature": X.columns,
    "Importance": best_rf.feature_importances_
})

feature_importance = feature_importance.sort_values(
    by="Importance",
    ascending=False
)

feature_importance

# %%
plt.figure(figsize=(8,5))

plt.barh(
    feature_importance["Feature"],
    feature_importance["Importance"]
)

plt.title("Feature Importance")

plt.xlabel("Importance Score")

plt.gca().invert_yaxis()

plt.show()

# %% [markdown]
# ### Observation
# 
# The graph shows that **Glucose**, **BMI**, **Age**, and **Diabetes Pedigree Function** are among the most influential features in predicting diabetes.
# 
# This information can later be displayed in the MediScan-AI application to explain why a particular prediction was made.

# %% [markdown]
# ## 12. Save Best Model
# 
# After hyperparameter tuning, the best-performing Random Forest model is saved using Joblib.
# 
# The saved model can later be loaded into the MediScan-AI Streamlit application for real-time diabetes prediction.

# %%
import joblib

# %%
joblib.dump(best_rf, "../models/diabetes_model.pkl")

print("Model saved successfully!")

# %%
loaded_model = joblib.load("../models/diabetes_model.pkl")

print(type(loaded_model))

# %% [markdown]
# # 13. Conclusion
# 
# This project successfully developed a Machine Learning model for diabetes prediction using the PIMA Indians Diabetes Dataset.
# 
# Multiple classification algorithms were trained and compared, including Logistic Regression, K-Nearest Neighbors, Decision Tree, Random Forest, and Support Vector Machine.
# 
# Among all models, the Random Forest Classifier achieved the best performance and was further optimized using GridSearchCV hyperparameter tuning.
# 
# The final optimized model was saved using Joblib and integrated into the MediScan-AI Streamlit application for real-time diabetes risk prediction.
# 
# Future improvements include:
# - Increasing model accuracy using advanced algorithms such as XGBoost or LightGBM.
# - Explaining predictions using SHAP values.
# - Supporting additional diseases in a single platform.
# - Deploying the application on the cloud for public access.
# 
# The developed system provides a reliable AI-assisted tool for preliminary diabetes risk assessment and educational healthcare support.


