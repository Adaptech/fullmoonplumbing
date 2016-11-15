export const filters = {
  eventType: ['PlumberHired', 'MadeAvailableForScheduling']
};

export function reducer(ratesSheet, eventData) {
  const event = eventData.event;
  switch(eventData.typeId) {
    case 'PlumberHired':
      ratesSheet.push({
        plumberId: event.plumberId,
        name: event.lastName + ", " + event.firstName,
        regularRate : event.regularRate,
        overtimeRate : event.overtimeRate
      });
      break;
    case 'RateChanged':
      const plumber = ratesSheet.filter(ratesSheetEntry => ratesSheetEntry.plumberId === event.plumberId );
      plumber[0].regularRate =  event.regularRate;
      plumber[0].overtimeRate =  event.overtimeRate;
      break;
    //TODO: Handle 'PlumberUpdated' events.
  }
  return ratesSheet;
}
