from flask import Flask, render_template, request, jsonify


app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/ending')
def ending():
    return render_template('win.html')


@app.route('/alternative_ending')
def alternative_ending():
    return render_template('lose.html')


if __name__ == '__main__':
    app.run()
