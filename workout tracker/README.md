MongoDB to store user info
Bruno to regist a user

register a user:  POST api/auth/register
login user POST api/auth/login


FAQs 


Use Bcrypt for password hashing
bcrypt securely hashes passwords, adding a salt to make brute-force attacks significantly harder

JWT
JWT encodes user information into a token, ensuring secure, stateless authentication. It’s useful for scaling as the server doesn’t need to store session data.

Expired Tokens
Include middleware to check token validity and return a proper error message if expired.