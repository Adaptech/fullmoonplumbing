export const filters = {
  eventType: ['PlumberCreated', 'PlumberIsAvailable']
};

export function reducer(ratesSheet, eventData) {
  const event = eventData.event;
  const metadata = eventData.metadata;
  switch(eventData.typeId) {
    case 'PlumberCreated':
      ratesSheet.push({
        plumberId: event.plumberId,
        name: event.lastName + ", " + event.firstName
      });
      break;
    case 'PlumberIsAvailable':
      const plumber = ratesSheet.filter(ratesSheetEntry => ratesSheetEntry.plumberId === event.plumberId );
      plumber[0].regularRate =  event.regularRate;
      plumber[0].overtimeRate =  event.overtimeRate;
      plumber[0].canBeScheduled = true;
      break;
    //TODO: Handle 'RateChanged' events. 
    //TODO: Handle 'PlumberUpdated' events.
  }
  return ratesSheet;
}
