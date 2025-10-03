# HTML :

```html
<!DOCTYPE html>
<!-- Use HTML5 doctype to enable standards mode. 
     Alternative: older/XHTML doctypes (not recommended); omitting it may trigger quirks mode and break layout calculations. -->

<html lang="en">
  <!-- Root element; lang helps accessibility/SEO and hyphenation.
       Alternative: set your real language code (e.g., "ro", "ru"). -->

  <head>
    <!-- Document metadata (not visible in the page body). -->
    <meta charset="UTF-8" />
    <!-- Character encoding; UTF-8 supports most languages and emoji. 
         Alternative: legacy encodings like ISO-8859-1 (avoid). -->

    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- Controls mobile zoom/viewport width.
         Alternatives: add `maximum-scale=1` (reduces pinch zoom; accessibility trade-off). -->

    <title>BULLSHIT-PROJECT</title>
    <!-- Title shown in browser tab and used by search engines.
         Alternative: keep it short & meaningful; can be set dynamically with JS for SPAs. -->

    <link rel="stylesheet" href="style.css" />
    <!-- External CSS for separation of concerns.
         Alternatives: 
         - <style>…</style> in <head> (inline CSS for small demos);
         - CSS-in-JS solutions (e.g., styled-components) in React projects. -->
  </head>

  <body>
    <!-- Visible document content. -->

    <!-- Navigation -->
    <header>
      <!-- Semantic container for top-of-page content like logos/nav. 
           Alternative: a plain <div> (loses semantic meaning). -->
      <nav class="navbar">
        <!-- Semantic navigation region. 
             Alternative: <div role="navigation"> for older ATs; class used for styling. -->

        <h1 class="logo">Example of Project written on HTML and CSS</h1>
        <!-- Main site heading (here inside nav).
             Alternatives:
             - Keep the only page <h1> in main content for better semantics;
             - Use an <a href="/">Brand</a> logo link. -->

        <ul class="nav-links">
          <!-- Unordered list is the accessible pattern for nav menus. 
               Alternative: <menu> (less supported); flex/grid for layout. -->
          <li><a href="#about">About</a></li>
          <!-- In-page link to the section with id="about".
               Alternatives:
               - Full-page routes (/about) in an SPA (React Router);
               - JS smooth scroll (CSS: scroll-behavior: smooth). -->
          <li><a href="#projects">Projects</a></li>
          <!-- Anchor to #projects; same considerations. -->
          <li><a href="#contact">Contact</a></li>
          <!-- Anchor to #contact. -->
        </ul>
      </nav>
    </header>

    <!-- Hero Section -->
    <section class="hero">
      <!-- A prominent section at the top. 
           Alternatives: <header> for “hero header”, or <section role="region"> with aria-label. -->
      <h2>Hello, I'm Mihai's first bullshit in HTML+CSS 👋</h2>
      <!-- Secondary heading (h2). 
           Alternative: make this the page’s <h1> if you want the hero to be the main heading. -->
      <p>Just <strong>Example</strong> of <strong>using HTML+CSS</strong>.</p>
      <!-- Paragraph with <strong> for semantic emphasis.
           Alternative: <b> (visual only); <em> for emphasis with intonation. -->
    </section>

    <!-- About -->
    <section id="about">
      <!-- id enables deep linking and skip navigation. 
           Alternative: data attributes for JS hooks; but id is standard for anchors. -->
      <h2>About:</h2>
      <!-- Section heading; sections should have headings for accessibility. -->
      <p>New section, id: about, and nothing else :D</p>
      <!-- Body copy. -->
    </section>

    <!-- Projects -->
    <section id="projects">
      <!-- Projects anchor target. -->
      <h2>Projects</h2>
      <ul>
        <!-- Unordered list of items. 
             Alternative: <ol> for ordered lists; <div> + CSS grid for complex cards. -->
        <li>🌐 1</li>
        <li>🌐 2</li>
        <li>🌐 3</li>
        <li>🌐 4</li>
        <li>🌐 5</li>
        <li>🌐 6</li>
      </ul>
    </section>

    <!-- Contact -->
    <section id="contact">
      <!-- Contact anchor target. -->
      <h2>Contact Me</h2>
      <form>
        <!-- Form without action/method submits to the same URL with GET by default (or triggers JS listeners).
                Alternatives:
                - action="/api/contact" method="POST" to send to server;
                - <form novalidate> to disable native validation when you roll your own. -->

        <label for="name">Name:</label>
        <!-- Clicking label focuses #name (accessibility). -->
        <input type="text" id="name" placeholder="Enter your name" required />
        <!-- `required` enables native validation.
             Alternatives: add `name="name"` to send a field in real submissions; 
             add `autocomplete="name"` for better UX. -->

        <label for="email">Email:</label>
        <!-- Native email validation + mobile email  keyboard. -->
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          required
        />

        <label for="message">Message:</label>
        <!--Initial visible rows; height still grows with content unless styled.  -->
        <textarea
          id="message"
          rows="4"
          placeholder="Write something..."
        ></textarea>
        <!-- Alternatives:
           - Add `required`, `minlength`, `maxlength`;
           - Use <input type="text"> for short messages. -->

        <button type="submit">Send</button>
        <!-- Submits the form (default type is "submit" anyway).
             Alternatives:
             - <input type="submit" value="Send" />;
             - Add `formmethod`, `formaction` for per-button overrides. -->
      </form>
    </section>

    <footer>
      <!-- Semantic footer at the end of the page/section. 
           Alternative: <div role="contentinfo"> for older ATs. -->
      <p>©FRANKIE 2025 BULLSHIT-PROJECT</p>
      <!-- Text content; consider &copy; for the symbol, or update dynamically with JS. -->
    </footer>
  </body>
</html>
```

# CSS :

```css
/* Global styles */
* {
  /* Universal selector affects all elements.
     Alternative: a more surgical reset (normalize.css, modern-css-reset). */
  margin: 0; /* Reset default margins (e.g., <h1>, <p>). 
                Alternative: rely on defaults and only zero where needed (less heavy-handed). */
  padding: 0; /* Reset default paddings (e.g., <ul>). */
  box-sizing: border-box; /* Includes padding & border in width/height calculations (saner layout math).
                             Alternatives: content-box (default, but harder to reason about); 
                             or set this only on layout components. */
  font-family: Arial, sans-serif; /* Global font stack.
                                      Alternatives: system stack (e.g., -apple-system, Segoe UI), variable fonts, or a webfont via @font-face/Google Fonts. */
}

body {
  line-height: 1.6; /* Improves readability; relative to current font-size.
                       Alternatives: unitless (recommended) vs px; adjust to 1.4–1.8 per design. */
  background-color: #f4f4f9; /* Light grayish background.
                                  Alternatives: CSS custom properties (e.g., var(--bg)); gradients; prefers-color-scheme dark support. */
  color: #333; /* Base text color (dark gray).
                    Alternative: #000 for max contrast; or HSL for easier theming. */
}

/* Navbar */
.navbar {
  display: flex; /* Flexbox for horizontal layout.
                    Alternatives: CSS Grid for more control; inline-block (older), or `display: flow-root` for simple clearing. */
  justify-content: space-between; /* Space between logo and links.
                                     Alternatives: `gap` plus `margin-left: auto` on the links; or grid template areas. */
  align-items: center; /* Vertical centering of children. */
  background: #222; /* Dark background. 
                         Alternatives: gradient, image, color tokens (var(--nav-bg)). */
  padding: 1rem 2rem; /* Responsive-ish spacing using rem. 
                         Alternatives: px, clamp(), container queries for smarter scaling. */
}

.logo {
  color: #fff; /* White brand/logo text.
                    Alternative: inherit + wrap in <a> for a clickable home link. */
}

.nav-links {
  list-style: none; /* Remove default bullets from <ul>. */
  display: flex; /* Lay out <li> horizontally. 
                    Alternative: use `gap` instead of per-<li> margins. */
}

.nav-links li {
  margin-left: 1.5rem; /* Space items apart.
                          Alternative: `.nav-links { gap: 1.5rem; }` (cleaner in modern browsers). */
}

.nav-links a {
  color: #fff; /* White links on dark nav. */
  text-decoration: none; /* Remove underline for a cleaner nav.
                            Alternatives: keep it and style with text-underline-offset for accessibility. */
  font-weight: bold; /* Emphasize nav items. */
}

.nav-links a:hover {
  color: #00bcd4; /* Hover color for feedback.
                       Alternatives: use :focus-visible for keyboard, add underline on hover for clearer affordance. */
}

/* Hero Section */
.hero {
  text-align: center; /* Center text inside hero. 
                         Alternative: flex/grid to center both vertically and horizontally. */
  padding: 2rem; /* Spacing inside hero. */
  background: #e0f7fa; /* Light teal background.
                            Alternatives: gradient (linear-gradient), background image, or use CSS variables. */
}

.hero img {
  border-radius: 50%; /* Make image circular (assumes a square image).
                         Alternatives: `clip-path: circle()`, or keep square with soft radius (e.g., 12px). */
  margin-top: 1rem; /* Space above the image. */
}

/* Sections */
section {
  padding: 2rem; /* Consistent section spacing.
                    Alternatives: logical properties (padding-block/padding-inline) for RTL-aware layouts. */
}

h2 {
  margin-bottom: 1rem; /* Space under headings for rhythm. */
  color: #222; /* Slightly lighter than pure black. 
                    Alternative: use currentColor and change parent container. */
}

/* Contact Form */
form {
  display: flex; /* Stack children with flexbox. 
                    Alternatives: CSS Grid (great for complex forms), or plain block flow with gaps. */
  flex-direction: column; /* Vertical stacking. */
  max-width: 400px; /* Limit line length and keep form compact.
                       Alternatives: clamp(320px, 80vw, 480px); responsive container queries. */
  margin: auto; /* Center horizontally (since a width is defined). */
}

form label {
  margin: 0.5rem 0 0.2rem; /* Space labels from inputs. 
                              Alternative: use a consistent `gap` on the form container (e.g., `row-gap`). */
}

form input,
form textarea {
  padding: 0.5rem; /* Touch-friendly controls. */
  border: 1px solid #ccc; /* Subtle border. 
                               Alternatives: outline-only focus styles, or border-color tokens. */
  border-radius: 5px; /* Slightly rounded corners. 
                         Alternatives: 0 for sharp, 9999px for pill, or design token var(--radius). */
}

form button {
  margin-top: 1rem; /* Space above button. */
  padding: 0.7rem; /* Comfortable tap target. */
  background: #00bcd4; /* Primary action color. 
                            Alternatives: gradient, :root variables, system-accent-color (future). */
  color: #fff; /* Contrast on colored bg. */
  border: none; /* Remove default button border. */
  border-radius: 5px; /* Rounded button. */
  cursor: pointer; /* Pointer cursor for better affordance. */
}

form button:hover {
  background: #0097a7; /* Darker shade on hover.
                            Alternatives: add `transition: background .2s` for smoothness; add active/disabled states. */
}

/* Footer */
footer {
  text-align: center; /* Center footer text. */
  padding: 1rem; /* Footer spacing. */
  background: #222; /* Dark footer to match nav. */
  color: #fff; /* White text for contrast. */
}
```
