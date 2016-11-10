# Domain Model

http://src/domain/Plumber.js

- Note that the plumber aggregate is not storing first- and lastname - the values are not required 
for evaluating business logic outside the CreatePlumber and UpdatePlumber command handlers which check for required fields.

- PlumberRequiredFieldError is part of the domain language.
 