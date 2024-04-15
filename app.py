from flask import Flask, render_template, make_response, redirect
import csv
import itertools
import os
from flask_socketio import SocketIO, send, emit

app = Flask(__name__)
socketio = SocketIO(app)

@app.route('/')
def index():
    return 'Welcome to Fundamentals of Computer Science'


@app.route('/basic')
def display_basic():
    with open('static/data/Kaggle_TwitterUSAirlineSentiment.csv', encoding='utf-8-sig') as csvfile:
        data = csv.reader(csvfile, delimiter=',')
        first_line = True
        tweetData = []

        for row in itertools.islice(data, 41):
            if not first_line:
                tweetData.append({
                    "id": row[0],
                    "airline_sentiment": row[1],
                    "airline_sentiment_confidence": row[2],
                    "negative+reason": row[3],
                    "airline": row[4],
                    "name": row[5],
                    "text": row[6],
                    "tweet_created": row[7],
                    "tweet_location": row[8]
                })
            else:
                first_line = False

    # We use the function below to sort the data based on the airline sentiment confidence value
    tweetData = sort_data_descending(tweetData, key="airline_sentiment_confidence")

    return render_template("basic.html", tweetData=tweetData)


# Below is the function to sort the array based on the key passed to it
def sort_data_descending(tweetData, key):
    n = len(tweetData)

    for i in range(n):
        already_sorted = True

        for j in range(n - i - 1):
            if tweetData[j][key] > tweetData[j + 1][key]:
                tweetData[j], tweetData[j + 1] = tweetData[j + 1], tweetData[j]
                already_sorted = False

        if already_sorted:
            break

    return tweetData


@app.route('/advanced')
def display_data_d3():
    return render_template("advanced.html")


@app.route('/creative')
def display_creative_data_d3():
    return render_template("creative.html")


@app.route('/websocket')
def display_websocket_example():
    return render_template("websocket.html")


@socketio.on("message")
def handleMessage(data):
    emit("new_message",data,broadcast=True)
if __name__ == "__main__":
    socketio.run(app, debug=True, port=5004)
