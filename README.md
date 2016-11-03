# Eventsourcing Explored: Full Moon Plumbing

Full Moon Plumbing is a sample application we designed and partly implemented for https://www.meetup.com/DDD-CQRS-ES/events/234682720/ :

As usual in the first session, we did an introduction to event sourcing, CQRS and domain driven design followed by an event storming:

![Full Moon Plumbing Eventstorm](FullMoonPlumbingEventStorm.png)

(About the Aggregator pattern used in the context map: http://www.enterpriseintegrationpatterns.com/patterns/messaging/Aggregator.html )

## Eventsourcing: How About Some Spreadsheets?

The Plumber List "legacy system" is done in Google Sheets, including the API which makes "PlumberCreated" and "PlumberUpdated" events
available to the Full Moon Plumbing scheduling service. 

It is a tongue-in-cheek attempt to show that we are overcomplicating eventsourcing and spending too much time on CRUD.

## Getting Started

### Installing the Plumber List Google Sheet

1. In Google Sheets, create a new sheet.
2. In "File->Import", upload ```./PlumberList/Full Moon Plumbing.ods```.
3. In "Tools -> Script Editor", replace the boilerplate code in Code.gs with the content of ```./PlumberList/Code.gs````.

