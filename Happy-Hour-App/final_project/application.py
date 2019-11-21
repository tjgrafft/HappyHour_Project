
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from sqlalchemy.orm import sessionmaker


from flask import Flask, jsonify, render_template
from config import aws_rds_connection_string


engine = create_engine(f'postgresql+psycopg2://{aws_rds_connection_string}')


Session = sessionmaker(bind = engine)
session = Session()

#################################################
# Database Setup
#################################################


# reflect an existing database into a new model
Base = automap_base()
# reflect the tables

Base.prepare(engine, reflect=True)


# Save reference to the table
Days = Base.classes.days
#HH = Base.classes.
BR = Base.classes.breweries
#GP = Base.classes.google_plus
VP = Base.classes.venues_plus
HH = Base.classes.happy_hours
Pricing = Base.classes.pricing

# Create our session (link) from Python to the DB
#session = Session(engine)

#################################################
# Flask Setup
#################################################
application = Flask(__name__)


#################################################
# Flask Routes
#################################################

@application.route("/")
def home():
    return render_template("index.html")
#@app.route("/")
#def welcome():
#    """List all available api routes."""
#    return (
#        f"Available Routes:<br/>"
#        f"/api/v1.0/happy<br/>"
#    )

@application.route("/api/v1.0/happy")
def happy():
    """Return a list of happy hour data including the venue, lat, and long of each venue"""
    # Query all venues
    results = session.query(VP.name, VP.latitude, VP.longitude).all()
    
    # Create a dictionary from the row data and append to a list of all_venue
    all_venues = []
    for name, lat, lon in results:
        venue_dict = {}
        venue_dict["name"] = name
        venue_dict["latitude"] = lat
        venue_dict["longitude"] = lon
        all_venues.append(venue_dict)
    
    return jsonify(all_venues)

@application.route("/specials")
def specials():
    results = session.query(VP.name,HH.description,HH.begin_time, HH.end_time,VP.latitude, VP.longitude,Pricing.dollar_signs).filter(HH.venue_id == VP.venue_id,VP.price == Pricing.value).limit(15)
 
    all_happy = []
    for name, description, begin_time, end_time, lat, lon, dollar_signs in results:
        happy_dict = {}
        happy_dict["name"] = name
        happy_dict["description"] = description
        happy_dict["begin_time"] = begin_time
        happy_dict["end_time"] = end_time
        happy_dict["latitude"] = lat
        happy_dict["longitude"] = lon
        happy_dict["price"] = dollar_signs
        all_happy.append(happy_dict)
    
    return jsonify(all_happy)

        
@application.route("/days")
def days():
    results = session.query(Days.dates, Days.day_name).all()
    all_days = []
    for dates,day_name in results:
        days_dict = {}
        days_dict["dates"] = dates
        days_dict["day_name"] = day_name
        all_days.append(days_dict)
    return jsonify(all_days)

@application.route("/breweries")
def breweries():
    results = session.query(BR.name, BR.address,BR.city, BR.state).all()
    all_breweries = []
    for name,address,city, state in results:
        all_breweries_dict = {}
        all_breweries_dict["name"] = name
        all_breweries_dict["address"] = address
        all_breweries_dict["city"] = city
        all_breweries_dict["state"]= state
        all_breweries.append(all_breweries_dict)
    return jsonify(all_breweries)

if __name__ == '__main__':
    application.run(debug=True)
