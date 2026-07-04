# Decisions

## The one decision that could have gone either way: Context + `useReducer` vs. Redux/Zustand

The app's entire global state surface is a single cart (an array of line items) plus a drawer-open boolean. There's no auth, no multi-entity caching, no undo/redo, nothing cross-cutting that a dedicated store library earns its keep on. So I went with `CartContext` + `useReducer`: a reducer with explicit actions (`ADD_ITEM`, `UPDATE_QUANTITY`, `REMOVE_ITEM`, `OPEN_DRAWER`, `CLOSE_DRAWER`) gives me the same predictable, action-based state transitions Redux is known for, without adding a dependency, a provider-wrapping ritual, or a learning curve for whoever reads the code next.

The honest trade-off: every component that calls `useCart()` re-renders whenever *any* part of the cart state changes, because Context doesn't support fine-grained selector subscriptions the way Redux or Zustand do. Right now that's a non-issue — a cart with a handful of line items re-rendering a navbar badge and a drawer is not a performance problem. If this app grew to have many independent pieces of global state, or if the cart itself needed to scale to hundreds of live-updating items, I'd reach for Zustand specifically (lighter than Redux, still gives selector-based subscriptions) rather than keep bolting more contexts on. I didn't pick Redux/Zustand here because that would be optimizing for a scale this app doesn't have — the honest answer is "the simplest thing that fully solves today's problem," not "the most impressive thing."

## What I'd clean up or do differently with more time

The color/size "pick a sensible default variant" logic is duplicated in spirit — `ProductCard`'s quick-add does it one way (first in-stock size) and `ProductDetailPage`'s URL-driven selection does it another. I'd pull that into one shared hook instead of two similar-but-not-identical implementations.

I'd also add real tests. I skipped them for this pass, but the cart reducer and the deterministic variant/price generators are pure functions with no side effects — exactly the kind of code that's cheap to test and expensive to get subtly wrong (off-by-one quantity clamping, a stock status that flips between reloads). Those would be the first things I'd cover.

The product grid isn't virtualized or paginated, which is fine for the Fake Store API's 20 products but wouldn't hold up against a real catalog. And I'd want to actually test the app with a screen reader rather than just adding `aria-*` attributes that look correct — accessibility markup that hasn't been driven with real assistive tech is a guess, not a verification.
