import ast
import pandas as pd
import uuid
import re

# df = pd.read_excel("analyze/data/data10.xlsx")
# df = pd.read_excel("analyze/data/data25_2.xlsx")
df = pd.read_excel("analyze/data/data33.xlsx")
df.fillna(0, inplace=True)

def process_value(value):
    if pd.notnull(value) and isinstance(value, (int, float)):
        if len(str(value)) > 3:
            rounded_value = round(value / 1000000) * 1000000
            if int(str(rounded_value)[0]) < 1:
                first_digit = int(str(value)[0])
                second_digit = int(str(value)[1])
                if second_digit > 4:
                    return str(first_digit + 1)
                else:
                    return str(first_digit)
            else:
                return str(rounded_value)[0]
        else:
            return str(value).split(".")[0]
    return value

# Apply the function to the desired columns
df["Q12"] = df["Q12"].apply(process_value)
df["Q31"] = df["Q31"].apply(process_value)


# get the user's desired column names
# column_names = input("Enter the names of the columns you want to retrieve, separated by commas: ")
valuable_column_names = "Duration (in seconds),Finished,Q1,Q2,Q3_1,Q3_2,Q3_3,Q3_4,Q3_5,Q3_6,Q4,Q5,Q6,Q7,Q8_1,Q8_2,Q8_3,Q8_4,Q8_5,Q9_1,Q9_2,Q10,Q11,Q12,Q20,Q21,Q22_1,Q22_2,Q22_3,Q22_4,Q22_5,Q22_6,Q23,Q24,Q25,Q26,Q27_1,Q27_2,Q27_3,Q27_4,Q27_5,Q28_1,Q28_2,Q29,Q30,Q31,Q29_1,Feedback,provenanceObject1,provenanceObject2,Condition,provenanceData1,provenanceData2,provenanceData3,provenanceData4,provenanceData5,provenanceData6,provenanceData7,provenanceData8,provenanceData9,provenanceData10,provenanceData11,provenanceData12,provenanceObject3,provenanceObject4,provenanceObject5,provenanceObject6,provenanceObject7,provenanceObject8,provenanceObject9,provenanceObject10,provenanceObject11,provenanceObject12"
column_names_for_timeseries_ana = "Q1,Q2,Q3_1,Q3_2,Q3_3,Q3_4,Q3_5,Q3_6,Q4,Q5,Q6,Q7,Q8_1,Q8_2,Q8_3,Q8_4,Q8_5,Q9_1,Q9_2,Q10,Q11,Q12,Q29_1,Duration (in seconds)"
column_names_for_pie_ana = "Q20,Q21,Q22_1,Q22_2,Q22_3,Q22_4,Q22_5,Q22_6,Q23,Q24,Q25,Q26,Q27_1,Q27_2,Q27_3,Q27_4,Q27_5,Q28_1,Q28_2,Q29,Q30,Q31,Q29_1,Duration (in seconds)"
column_names_for_timeseries = "Q1,Q2,Q3_1,Q3_2,Q3_3,Q3_4,Q3_5,Q3_6,Q4,Q5,Q6,Q7,Q8_1,Q8_2,Q8_3,Q8_4,Q8_5,Q9_1,Q9_2,Q10,Q11,Q12"
column_names_for_pie = "Q20,Q21,Q22_1,Q22_2,Q22_3,Q22_4,Q22_5,Q22_6,Q23,Q24,Q25,Q26,Q27_1,Q27_2,Q27_3,Q27_4,Q27_5,Q28_1,Q28_2,Q29,Q30,Q31"
column_names_for_object = "provenanceObject1,provenanceObject2,provenanceObject3,provenanceObject4,provenanceObject5,provenanceObject6,provenanceObject7,provenanceObject8,provenanceObject9,provenanceObject10,provenanceObject11,provenanceObject12"
column_names_for_data = "provenanceData1,provenanceData2,provenanceData3,provenanceData4,provenanceData5,provenanceData6,provenanceData7,provenanceData8,provenanceData9,provenanceData10,provenanceData11,provenanceData12"
column_names_for_feedback = "Q29_1,Feedback"

def expected_value(column_name):
    if (column_name == 'Q1') or (column_name == 'Q20'): return 1
    elif (column_name == 'Q2') or (column_name == 'Q21'): return 9
    elif (column_name == 'Q3_1') or (column_name == 'Q22_1'): return 0
    elif (column_name == 'Q3_2') or (column_name == 'Q22_2'): return 2
    elif (column_name == 'Q3_3') or (column_name == 'Q22_3'): return 1
    elif (column_name == 'Q3_4') or (column_name == 'Q22_4'): return 1
    elif (column_name == 'Q3_5') or (column_name == 'Q22_5'): return 0
    elif (column_name == 'Q3_6') or (column_name == 'Q22_6'): return 0
    elif (column_name == 'Q4') or (column_name == 'Q23'): return '1,2,3,4,5'
    elif (column_name == 'Q5') or (column_name == 'Q24'): return 1
    elif (column_name == 'Q6') or (column_name == 'Q25'): return 1
    elif (column_name == 'Q7') or (column_name == 'Q26'): return 1
    elif (column_name == 'Q8_1') or (column_name == 'Q27_1'): return 0
    elif (column_name == 'Q8_2') or (column_name == 'Q27_2'): return 0
    elif (column_name == 'Q8_3') or (column_name == 'Q27_3'): return 51
    elif (column_name == 'Q8_4') or (column_name == 'Q27_4'): return 44
    elif (column_name == 'Q8_5') or (column_name == 'Q27_5'): return 3
    elif (column_name == 'Q9_1') or (column_name == 'Q28_1'): return 4
    elif (column_name == 'Q9_2') or (column_name == 'Q28_2'): return 2
    elif (column_name == 'Q10') or (column_name == 'Q29'): return 68
    elif (column_name == 'Q11') or (column_name == 'Q30'): return '1,2,3'
    elif (column_name == 'Q12') or (column_name == 'Q31'): return 3
    else: return False

def get_result(selected_column_names):
    if not selected_column_names:
        selected_column_names = valuable_column_names # default
    
    column_names = selected_column_names.split(',')

    # retrieve the specified columns and print the results
    for column in column_names:
        if column not in df.columns:
            print(f"Column '{column}' not found in the Excel file.")
        else:
            data = df[column].tolist()
            print(f"{column}: {data}")
            
def get_finish_rate(condition):
    # compute the finish rate (column name = Finished value = true) for the specified condition
    filtered_df = df[df['Condition'] == condition]
    finished_cases = filtered_df[filtered_df['Finished'] == True]
    total_cases = len(filtered_df)
    finish_rate = len(finished_cases) / total_cases * 100
    finish_rate = round(finish_rate, 4)

    return finish_rate
    
def get_average_feedback(condition):
    filtered_df = df[df['Condition'] == condition]
    feedback_df = filtered_df[pd.to_numeric(filtered_df['Q29_1'], errors='coerce').notnull()]
    average_feedback = feedback_df['Q29_1'].mean()
    average_feedback = round(average_feedback, 4)

    return average_feedback

def get_average_time(condition):
    filtered_df = df[df['Condition'] == condition]
    time_df = filtered_df[pd.to_numeric(filtered_df['Duration (in seconds)'], errors='coerce').notnull()]
    average_time = time_df['Duration (in seconds)'].mean()
    average_time = round(average_time, 4)

    return average_time
            
def get_result_by_condition(condition):
    total_response = 0
    total_success = 0
    scores = {}
    results = {}
    if condition == 'pie':
        column_names = column_names_for_pie.split(',')

        # Filter rows with condition == 'pie'
        filtered_df = df[df['Condition'] == 'pie']
                
    elif condition == 'timeseries':
        column_names = column_names_for_timeseries.split(',')

        # Filter rows with condition == 'timeseries'
        filtered_df = df[df['Condition'] == 'timeseries']
        
    # retrieve the specified columns and print the results
    for column in column_names:
        if column not in filtered_df.columns:
            results[column] = f"Column '{column}' not found in the Excel file."
        else:
            data = filtered_df[column].tolist()
            results[column] = data
            
    for column in results:
        question = column
        success_count = 0
        response_count = len(results[column])
        
        for value in results[column]:
            if str(expected_value(column)) == str(value).split(".")[0]:
                success_count += 1
            # else:
            #     print(f"Expected: {expected_value(column)}, Actual: {value}")
        scores[question] = round((success_count / response_count) * 100, 2)
        total_success += success_count
        total_response += response_count
    
    print(f"Total Success for {condition}: {total_success}/{total_response} = {round(total_success/total_response, 2)}\n")
    table = pd.DataFrame(scores, index=[condition])
    print(table) 
    print(f"Average Finish Rate for {condition}: {get_finish_rate(condition)}%\n")
    print(f"Average Feedback for {condition}: {get_average_feedback(condition)}\n")
    print(f"Average Time for {condition}: {get_average_time(condition)}\n")
    return scores
        
def get_result_by_pid(condition):
    
    if condition == 'pie':
        column_names = column_names_for_pie_ana.split(',')
                
    elif condition == 'timeseries':
        column_names = column_names_for_timeseries_ana.split(',')
    
    result_dict = {}
    filtered_df = df[df['Condition'] == condition]
    
    # feedback_df = filtered_df[pd.to_numeric(filtered_df['Q29_1'], errors='coerce').notnull()]
    # time_df = filtered_df[pd.to_numeric(filtered_df['Duration (in seconds)'], errors='coerce').notnull()]
    feedback = 0
    time = 0
    
    # Iterate over each row in the DataFrame
    for index, row in filtered_df.iterrows():
        total_success = 0
        total_response = 0

        # Compute scores for each question in the specified columns
        for column in column_names:
            if column in filtered_df.columns:
                if column == 'Q29_1':
                    feedback = row[column]
                elif column == 'Duration (in seconds)':
                    time = row[column]
                else:
                    if expected_value(row[column]) == str(row[column]).split(".")[0]:
                        total_success += 1
                    total_response += 1

        # Calculate the total score for the row
        total_score = round((total_success / total_response) * 100, 2)

        # Generate a unique UUID for the row
        row_uuid = uuid.uuid4()
        # Store the total score in the result dictionary with the UUID as the key
        result_dict[row_uuid] = {"score":total_score, "feedback":feedback,"time":time}
    result_dict = pd.DataFrame.from_dict(result_dict, orient='index')
    print(result_dict)
    return result_dict

def get_average_interations_only(condition):
    results = {}
    provenance = {}
    filtered_df = df[df['Condition'] == condition]
    column_names = column_names_for_data.split(',')
    for column in column_names:
        if column not in filtered_df.columns:
            results[column] = f"Column '{column}' not found in the Excel file."
        else:
            data = filtered_df[column].tolist()
            results[column] = data
    for column in results:
        question = column
        provenance[question] = 0
        for events in results[column]:
            if type(events) is not str: continue
            events_list = ast.literal_eval(events)
            num_interactions = len(events_list)
            provenance[question] += num_interactions
        provenance[question] = round(provenance[question] / len(results[column]),2)
    print(provenance)
    return provenance

def get_average_interations(condition):
    results = {}
    provenance = {}
    filtered_df = df[df['Condition'] == condition]
    column_names = column_names_for_data.split(',')
    for column in column_names:
        if column not in filtered_df.columns:
            results[column] = f"Column '{column}' not found in the Excel file."
        else:
            data = filtered_df[column].tolist()
            results[column] = data
    for column in results:
        question = column
        provenance[question] = { "num_interactions": 0, "num_hover": 0, "num_select": 0 }
        for events in results[column]:
            if type(events) is not str: continue
            events_list = ast.literal_eval(events)
            num_interactions = len(events_list)
            num_hover = 0
            num_select = 0
            provenance[question]["num_interactions"] += num_interactions
            for event in events_list:
                if "selected" in event.lower():
                    num_select += 1
                elif "hover" in event.lower():
                    num_hover += 1
            provenance[question]["num_hover"] += num_hover
            provenance[question]["num_select"] += num_select
        provenance[question]["num_interactions"] = round(provenance[question]["num_interactions"] / len(results[column]), 2)
        provenance[question]["num_hover"] = round(provenance[question]["num_hover"] / len(results[column]),2)
        provenance[question]["num_select"] = round(provenance[question]["num_select"] / len(results[column]),2)
    table = pd.DataFrame.from_dict(provenance, orient='index')
    # print(table)
    # print(provenance)
    return provenance

def get_average_time_per_question(condition):
    filtered_df = df[df['Condition'] == condition]
    column_names = column_names_for_object.split(',')
    results = {}
    provenance = {}
    for column in column_names:
        if column not in filtered_df.columns:
            results[column] = f"Column '{column}' not found in the Excel file."
        else:
            data = filtered_df[column].tolist()
            results[column] = data
    for column in results:
        question = column
        provenance[question] = 0
        for events in results[column]:
            if type(events) != str: continue
            events = events[-10:]
            match = re.search(r"\}(\d+)", events)
            if match:
                last_numeric_value = match.group(1)
                provenance[question] += int(last_numeric_value)
        provenance[question] = round(provenance[question] / len(results[column]) / 1000, 2)
    table = pd.DataFrame(provenance, index=[condition])
    print(table) 
    return provenance

# def main():
    
#     print("\n\n Condition: PIE \n\n")
    
#     get_result_by_condition('pie')
#     print("Individual Results: (in percentage of accuracy)\n")
#     get_result_by_pid('pie')
    
#     print("\n\n Condition: TIMESERIES \n\n")

#     get_result_by_condition('timeseries')
#     print("Individual Results: (in percentage of accuracy)\n")
#     get_result_by_pid('timeseries')
#     get_average_interations('timeseries')
    
#     get_average_time_per_question('timeseries')
    
    
# main()

get_result_by_condition('pie')
get_result_by_condition('timeseries')
