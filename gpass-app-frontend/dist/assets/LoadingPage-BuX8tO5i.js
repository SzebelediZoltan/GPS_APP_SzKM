import{j as e,a4 as o,p as s,ac as d}from"./index-B33ojN8a.js";const l=d("inline-flex items-center justify-center rounded-full border border-transparent px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",{variants:{variant:{default:"bg-primary text-primary-foreground [a&]:hover:bg-primary/90",secondary:"bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",destructive:"bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",outline:"border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",ghost:"[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",link:"text-primary underline-offset-4 [a&]:hover:underline"}},defaultVariants:{variant:"default"}});function u({className:a,variant:r="default",asChild:t=!1,...i}){const n=t?o:"span";return e.jsx(n,{"data-slot":"badge","data-variant":r,className:s(l({variant:r}),a),...i})}function p({className:a,label:r="Betöltés...",fullscreen:t=!0}){return e.jsxs("div",{className:s(t?"min-h-[calc(100vh-0px)]":"w-full","grid place-items-center bg-background text-foreground",a),role:"status","aria-live":"polite","aria-busy":"true",children:[e.jsxs("div",{className:"flex flex-col items-center gap-4",children:[e.jsxs("div",{className:"relative h-16 w-16",children:[e.jsx("span",{className:"absolute inset-0 rounded-full border-2 border-primary/35 animate-[gpass-ripple_1.25s_ease-out_infinite]"}),e.jsx("span",{className:"absolute inset-0 rounded-full border-2 border-primary/35 animate-[gpass-ripple_1.25s_ease-out_infinite] [animation-delay:0.35s]"}),e.jsx("span",{className:"absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-sm"})]}),r?e.jsx("p",{className:"text-sm text-muted-foreground",children:r}):null]}),e.jsx("style",{children:`
        @keyframes gpass-ripple {
          0% {
            transform: scale(0.2);
            opacity: 0.9;
          }
          70% {
            opacity: 0.25;
          }
          100% {
            transform: scale(1.15);
            opacity: 0;
          }
        }
      `})]})}export{u as B,p as L};
