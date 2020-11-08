

from flask import Flask, render_template, request
import os
import pandas as pd

app = Flask(__name__)
ROOT_PATH = os.path.dirname(os.path.abspath(__file__))


def get_crop_data(df_csv, pincode_csv, pincode, season, year):
    district = pincode_csv[pincode_csv['pincode'] == pincode]['Districtname'].iloc[1]
    district = district.upper()
    df_dist = df_csv[df_csv['District_Name'] == district]
    df_dist_year = df_dist[df_dist['Crop_Year'] == year]
    crops_df = df_dist_year[df_dist_year['Season'] == season][['Crop', 'Yeild']]
    return crops_df


def get_most_profitable_crop(df, pincode_csv, crop_profit, pincode, season):
    district = pincode_csv[pincode_csv['pincode'] == pincode]['Districtname'].iloc[1]
    district = district.upper()
    df_2014 = df[df['Crop_Year'] == 2014]
    details = df_2014[df_2014['District_Name'] == district]
    details2 = details[details['Season'] == season][['Crop', 'Yeild']]
    crop_inDistrict = list(details2['Crop'])
    crop_name_trimmed = []
    profit = []
    for crop in crop_inDistrict:
        actual_name = crop
        crop = crop.split(sep='/')[0]
        crop = crop.split(sep='(')[0]
        crop = crop.split(sep=' ')[0]
        if len(crop_profit[crop_profit['crop'] == crop]) == 0:
            break;
        crop_name_trimmed.append([crop, actual_name])
    for crop in crop_name_trimmed:
        crop_price = list(crop_profit[crop_profit['crop'] == crop[0]]['marketPrice'])[0]
        crop_yeild = list(details2[details2['Crop'] == crop[1]]['Yeild'])[0]
        profit.append(crop_price * crop_yeild)
    index = profit.index(max(profit))
    return crop_name_trimmed[index][1]


@app.route('/')
def index():
    return render_template('index1.html')


@app.route('/crop_predictor')
def crop_predictor():
    return render_template('crop_predictor.html')


@app.route('/weather_forecast')
def weather_forecast():
    return render_template('index.html')


@app.route('/news')
def news():
    return render_template('news.html')


@app.route('/about_us')
def about_us():
    return render_template('about_us.html')


@app.route('/handle_result', methods=['GET', 'POST'])
def handle_result():

    df = pd.read_csv(os.path.join(ROOT_PATH, 'csv/apy.csv'))
    df2 = pd.read_csv(os.path.join(ROOT_PATH, 'csv/pincode.csv'))
    crop_profit = pd.read_excel('csv/cropProfit.xls')
    df['Yeild'] = round(df['Production'] / df['Area'], 2)
    if request.method == 'POST':
        result = request.form
        pincode = int(result['pincode'])
        season = result['season']
        if season == 'Kharif':
            season = 'Kharif     '
        elif season == 'Rabi':
            season = 'Rabi       '
        elif season == 'Summer':
            season = 'Summer     '
        crop_df = get_crop_data(df, df2, pincode, season, 2014)
        profitable_crop = get_most_profitable_crop(df, df2, crop_profit,pincode,season)
        dict_crop = crop_df.set_index('Crop')['Yeild'].to_dict()
    return render_template('result.html', result=[dict_crop,profitable_crop])


if __name__ == '__main__':
    app.run(debug=True)
