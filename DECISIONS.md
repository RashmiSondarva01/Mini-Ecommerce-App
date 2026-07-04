# Decisions

## The decision I could have gone either way on: Context + useReducer vs Redux/Zustand

For this app, all the global state is just the cart items and whether the cart drawer is open or closed. That's it — no login, no complicated data caching, nothing fancy. Because of that, I didn't think a full state management library like Redux was worth adding.

I used React's built-in Context + useReducer instead. I set up a reducer with clear actions like `ADD_ITEM`, `UPDATE_QUANTITY`, `REMOVE_ITEM`, `OPEN_DRAWER`, `CLOSE_DRAWER`. This gives me the same predictable way of updating state that Redux is known for, but without pulling in an extra library or extra setup.

The downside: every component that uses the cart re-renders whenever anything in the cart changes, because Context doesn't let you subscribe to just one small piece of state the way Redux or Zustand can. For this app that doesn't matter — the cart only ever has a few items. If the app got a lot bigger, or had way more separate pieces of global state, I'd probably switch to Zustand, since it's lighter than Redux but still avoids extra re-renders. I didn't want to add that complexity now for a problem I don't actually have.

## What I'd improve with more time

Right now, the logic that picks a default color/size for a product is written twice in two different places — once for the "quick add" button on the product list, and once on the product detail page. They do almost the same thing but not quite identically. I'd combine this into one shared function so there's only one place to fix if something breaks.

I also didn't write any automated tests. With more time, I'd start with the cart logic and the code that generates product variants and prices, since those are simple functions that are easy to test and easy to get subtly wrong (like quantity limits or stock status).

The product list also isn't paginated or virtualized — that's fine for the 20 products this API gives us, but it wouldn't hold up for a real store with thousands of items.

Lastly, I added accessibility attributes (aria-labels, roles, etc.) based on what's generally correct, but I never actually tested it with a real screen reader. I'd want to do that to make sure it actually works for someone using one, not just that it looks right on paper.
