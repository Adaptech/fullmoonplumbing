# Domain Model

http://src/domain/Plumber.js

- Note that the plumber aggregate is not storing first- and lastname - the values are not required 
for evaluating business logic outside the CreatePlumber and UpdatePlumber command handlers which check for required fields.

- PlumberRequiredFieldError is part of the domain language.

- Take a look at _updatePlumber(). This is an example of a command potentially publishing more than one event. 
The reason: "PlumberUpdated" isn't very descriptive. This can make the code harder to maintain because it's less obvious what 
things mean in the context of (in this case) scheduling plumbers while optimizing overtime payments. A read model which is interested in (e.g.) rate changes can subscribe
to "RateChanged" without needing to parse that fact out of a more general "PlumberUpdated" occurrence. Same with PlumberAvailable 
and PlumberUnavailable - when scheduling, we care when those occurred but we could conceivably ignore (e.g.) name changes.
 
# Exercise:

- PlumberUpdated events should only happen if the first- or lastname have actually changed. At the moment, they are happening
regardless whether a change occurred. (To get started, look for '//TODO' in the code.)