# Neurone-Auth

The Neurone-Auth backend is in charge of user authentication. The other back-end components communicate with Neurone-Auth to check if the user is on a valid seession before accessing the protected database assets.&#x20;

It uses user accounts saved in a MongoDB database, with a hashed password and a salt that can be configured in environment variables. For authentication it uses a JWT that's sent to the client.&#x20;

{% hint style="info" %}
In the front-end components, the Neurone-Navbar component is in charge of administrating accounts using Neurone-Auth, just by adding this component to your Angular project, you already have a working user accounts system.
{% endhint %}

JWT flow diagram:&#x20;

![Source: https://www.vaadata.com/blog/jwt-tokens-and-security-working-principles-and-use-cases/](https://www.vaadata.com/blog/wp-content/uploads/2016/12/JWT\_tokens\_EN.png)
