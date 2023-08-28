import matplotlib.pyplot as plt
import pandas as pd

from analyze_single import *

def do_name_change(dictionary):
    new_dict = {}
    new_names = ['Q1','Q2','Q3_1','Q3_2','Q3_3','Q3_4','Q3_5','Q3_6','Q4','Q5','Q6','Q7','Q8_1','Q8_2','Q8_3','Q8_4','Q8_5','Q9_1','Q9_2','Q10','Q11','Q12']
    for i, key in enumerate(dictionary.keys()):
        new_dict[new_names[i]] = dictionary[key]
    return new_dict

def do_name_change_time(dictionary):
    new_dict = {}
    order = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9', 'Q10', 'Q11', 'Q12']
    for i, key in enumerate(dictionary.keys()):
        new_dict[order[i]] = dictionary[key]
    return new_dict
    
def plot_scores():

    pie_score = get_result_by_condition('pie')
    pie_score = do_name_change(pie_score)
    timeseries_score = get_result_by_condition('timeseries')

    pie_df = pd.DataFrame(pie_score, index=['pie']).T.reset_index()
    pie_df.columns = ['Questions', 'Score']
    pie_df['Survey Type'] = 'Pie'

    timeseries_df = pd.DataFrame(timeseries_score, index=['time_series']).T.reset_index()
    timeseries_df.columns = ['Questions', 'Score']
    timeseries_df['Survey Type'] = 'Time Series'

    # Combine the Dataframes
    df = pd.concat([pie_df, timeseries_df])
    
    order = ['Q1', 'Q2', 'Q3_1', 'Q3_2', 'Q3_3', 'Q3_4', 'Q3_5', 'Q3_6', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8_1', 'Q8_2', 'Q8_3', 'Q8_4', 'Q8_5', 'Q9_1', 'Q9_2', 'Q10', 'Q11', 'Q12']
    df = df.reset_index()
    ax = df.pivot(index='Questions', columns='Survey Type', values='Score').loc[order].plot(kind='bar', 
                                                                                            figsize=(15,8), 
                                                                                            fontsize=12, 
                                                                                            rot=0, 
                                                                                            edgecolor='grey', 
                                                                                            linewidth=0.5)
    ax.set_title("Survey Score Results", fontsize=18)
    ax.set_xlabel("Questions Number", fontsize=14)
    ax.set_ylabel("Accuracy (%)", fontsize=14)

    ax.legend(fontsize=12)
    
    plt.show()

def plot_time():

    pie_time = get_average_time_per_question('pie')
    pie_time = do_name_change_time(pie_time)
    timeseries_time = get_average_time_per_question('timeseries')
    timeseries_time = do_name_change_time(timeseries_time)

    pie_df = pd.DataFrame(pie_time, index=['pie']).T.reset_index()
    pie_df.columns = ['Questions', 'Time']
    pie_df['Survey Type'] = 'Pie'

    timeseries_df = pd.DataFrame(timeseries_time, index=['time_series']).T.reset_index()
    timeseries_df.columns = ['Questions', 'Time']
    timeseries_df['Survey Type'] = 'Time Series'

    # Combine the Dataframes
    df = pd.concat([pie_df, timeseries_df])
    
    order = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9', 'Q10', 'Q11', 'Q12']
    df = df.reset_index()
    ax = df.pivot(index='Questions', columns='Survey Type', values='Time').loc[order].plot(kind='bar', 
                                                                                            figsize=(15,8), 
                                                                                            fontsize=12, 
                                                                                            rot=0, 
                                                                                            edgecolor='grey', 
                                                                                            linewidth=0.5)
    ax.set_title("Survey Time Results", fontsize=18)
    ax.set_xlabel("Questions Number", fontsize=14)
    ax.set_ylabel("Average Time (Seconds)", fontsize=14)

    ax.legend(fontsize=12)
    
    plt.show()
 
def plot_interactions():
    pie_interactions = get_average_interations_only('pie')
    pie_interactions = do_name_change_time(pie_interactions)
    timeseries_interactions = get_average_interations_only('timeseries')
    timeseries_interactions = do_name_change_time(timeseries_interactions)

    pie_df = pd.DataFrame(pie_interactions, index=['pie']).T.reset_index()
    pie_df.columns = ['Questions', 'Interactions']
    pie_df['Survey Type'] = 'Pie'

    timeseries_df = pd.DataFrame(timeseries_interactions, index=['time_series']).T.reset_index()
    timeseries_df.columns = ['Questions', 'Interactions']
    timeseries_df['Survey Type'] = 'Time Series'
    

    # Combine the Dataframes
    df = pd.concat([pie_df, timeseries_df])
    
    order = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9', 'Q10', 'Q11', 'Q12']
    df = df.reset_index()
    ax = df.pivot(index='Questions', columns='Survey Type', values='Interactions').loc[order].plot(kind='bar', 
                                                                                            figsize=(15,8), 
                                                                                            fontsize=12, 
                                                                                            rot=0, 
                                                                                            edgecolor='grey', 
                                                                                            linewidth=0.5)
    ax.set_title("Survey Interactions Results", fontsize=18)
    ax.set_xlabel("Questions Number", fontsize=14)
    ax.set_ylabel("Average Interactions", fontsize=14)

    ax.legend(fontsize=12)
    
    plt.show()
 
    
if __name__ == '__main__':
    plot_scores()
    plot_time()
    plot_interactions()

