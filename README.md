## inertia-react-query-state 2

[![npm version](https://img.shields.io/npm/v/inertia-react-query-state.svg)](https://www.npmjs.com/package/inertia-react-query-state)
[![npm downloads](https://img.shields.io/npm/dm/inertia-react-query-state.svg)](https://www.npmjs.com/package/inertia-react-query-state)
[![license](https://img.shields.io/npm/l/inertia-react-query-state.svg)](https://github.com/nomansheikh/inertia-react-query-state/blob/main/LICENSE)

Elegant query string state for Inertia.js + React, made for Laravel filters. Keep your filters in the URL, persist on reload, and navigate with real Inertia visits automatically.

### Why

When filtering data in a Laravel app, you often want to:
- pass filter values to the backend via query parameters
- preserve filters on reload or when sharing a link
- keep Inertia navigation and page state intact

This hook binds a piece of React state to a query-string key and triggers `router.visit` on change. On mount, it initializes from the current URL — you do NOT need to pass the default filter value from the backend. The URL is the single source of truth.

### Requirements

- React 18+
- `@inertiajs/react` v2+ (peer dependency; ensure it exists in your project)

### Install

```bash
yarn add inertia-react-query-state
```

### Quick start

```tsx
import useInertiaQueryState from "inertia-react-query-state"

export default function ProductsPage() {
  const [search, setSearch] = useInertiaQueryState<string>("search")

  return (
    <input
      value={search ?? ""}
      onChange={e => setSearch(e.target.value)}
      placeholder="Search products..."
    />
  )
}
```

Changing the input updates `?search=` in the URL and performs an Inertia visit with `preserveState: true` and your provided options.

### Laravel example

Controller (simplified):

```php
// app/Http/Controllers/ProductController.php
use App\Models\Product;
use Inertia\Inertia;

public function index()
{
    $search = request('search');

    $products = Product::query()
        ->when($search, fn ($q) => $q->where('name', 'like', "%{$search}%"))
        ->latest()
        ->paginate(15)
        ->withQueryString(); // keep filters in pagination links

    return Inertia::render('Products/Index', [
        'products' => $products
    ]);
}
```

React page:

```tsx
import useInertiaQueryState from "inertia-react-query-state"

export default function ProductsIndex({ products }) {
  const [search, setSearch] = useInertiaQueryState("search")

  // render products table ...
}
```

### Multiple filters

Use one hook per query key:

```tsx
const [status, setStatus] = useInertiaQueryState("status", { resetValue: "all" })
const [category, setCategory] = useInertiaQueryState("category")
```

### Debouncing text input

```tsx
const [raw, setRaw] = useState("")
const [search, setSearch] = useInertiaQueryState("search")

useEffect(() => {
  const id = setTimeout(() => setSearch(raw), 300)
  return () => clearTimeout(id)
}, [raw])
```

### Default value behavior

- On mount, the hook reads from the URL and uses that value if present.
- If the URL has no value for the key, `defaultValue` (if provided) is used as the initial state.
- `defaultValue` is for when you want to start with a specific value even when the URL is empty — you do not need to pass defaults from Laravel.

### API

```ts
const [value, setValue] = useInertiaQueryState<T>(key: string, options?: {
  defaultValue?: T
  resetValue?: string
  // Any VisitOptions from @inertiajs/core except `preserveState` (always true)
  // Examples: replace, only, onSuccess, onError, data, etc.
}): readonly [T | undefined, React.Dispatch<React.SetStateAction<T | undefined>>]
```

### Options

- **defaultValue**: Initial value when the URL has no value for the key. Use when you want the filter to start with a specific value on first render. Once the user changes it, the URL becomes the source of truth.
- **resetValue**: If the state equals this string, the query parameter is removed from the URL. Useful for sentinel values like "all" or "none" to mean "no filter applied".
- **VisitOptions passthrough**: Any `VisitOptions` from `@inertiajs/core` (except `preserveState`, which is always `true`) are forwarded to `router.visit`. Useful when you need to customize the visit:
  - **only**: Request only specific props from the server to optimize payloads
  - **data**: Send additional data with the visit
  - **headers**: Add custom headers
  - **onSuccess / onError / onFinish**: Lifecycle callbacks
  - **replace**: Replace the current history entry instead of pushing a new one. Optional; helpful if you don't want a new history entry for each filter keystroke. You do not need to pass this for normal usage.

### Notes

- Values are written to the URL as strings and read back as strings; use `T = string` or convert as needed.
- `preserveState` is forced to `true` so your page component tree stays stable across visits.
- Works on the client (browser) – this hook reads `window.location`.

### Scripts

```bash
yarn build
yarn test
```

### License

MIT
