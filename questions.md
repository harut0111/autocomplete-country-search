### 1. What is the difference between `Component` and `PureComponent`?  
**Give an example where it might break my app.**

The core difference is re-rendering behavior.  
By default, a React `Component` re-renders whenever its parent re-renders or its state updates.  
React `PureComponent` is used for performance optimization. It checks whether the state or props have actually changed before triggering a re-render.  
However, since `PureComponent` uses shallow comparison, it can lead to issues with nested objects.  
If you update a nested object but keep the reference the same, `PureComponent` won’t detect the change and may skip the necessary re-render.

---

### 2. Context + `shouldComponentUpdate` might be dangerous. Why is that?

In the middle of a deeply nested component subtree, you might have a `shouldComponentUpdate` method that returns `false`.  
This can be dangerous because it blocks render propagation through the whole tree, preventing child components from updating even if context or props have changed.

---

### 3. Describe 3 ways to pass information from a component to its **parent**.

1. **Callback Functions (Props):** 
2. **Forward Refs:** 
3. **Global state management tool like Redux:** 

---

### 4. Give 2 ways to prevent components from re-rendering.

1. Use `React.memo()`
2. Use `useCallback` hook in the parent component

---

### 5. What is a fragment and why do we need it?  
**Give an example where it might break my app.**

A Fragment is a wrapper that lets you group multiple elements when you don’t want to use an actual DOM element.  
To be honest, I can’t remember a case in my own practice where a fragment caused my app to break.

---

### 6. Give 3 examples of the HOC pattern.

- `withLogging` – Adds logging functionality to a component or function.
- `withAuth` – Performs an authentication check before rendering the component.
- `withExtraProps` – Injects additional props into the wrapped component.

---

### 7. What's the difference in handling exceptions in promises, callbacks and async...await?

- With Promises, you can use the `.catch()` method to handle exceptions.
- With callbacks and async/await, you typically use `try {}` `catch {}` syntax to handle exceptions.

---

### 8. How many arguments does `setState` take and why is it async?

- The new state object
- Callback that runs after the state has been updated

---

### 9. List the steps needed to migrate a Class to Function Component.

1. Replace the class with a function
2. Remove `this`, constructor, lifecycle methods, and other class-specific syntax
3. Use Hooks for state management and lifecycle logic

---

### 10. List a few ways styles can be used with components.

1. Use classes (e.g. Tailwind CSS)
2. Inline Styles
3. Import `.css` files
4. Styled Components

---

### 11. How to render an HTML string coming from the server.

I haven’t had this kind of experience yet, so I can’t say exactly what the best approach is. However, I think it can be dangerous if you render an HTML string without checking or sanitizing the content. It could lead to security issues.