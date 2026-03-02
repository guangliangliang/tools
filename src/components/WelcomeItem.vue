<template>
  <div class="item">
    <i>
      <slot name="icon"></slot>
    </i>
    <div class="details">
      <h3>
        <slot name="heading"></slot>
      </h3>
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.item {
  margin-top: 2rem;
  display: flex;
  position: relative;
  padding: 1.5rem;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--color-background-soft) 0%, var(--color-background) 100%);
  border: 1px solid var(--color-border);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--vt-c-gradient-start), var(--vt-c-gradient-end));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

@media (hover: hover) {
  .item:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg), var(--shadow-glow);
    border-color: var(--vt-c-gradient-start);
  }

  .item:hover::before {
    transform: scaleX(1);
  }
}

.details {
  flex: 1;
  margin-left: 1rem;
}

i {
  display: flex;
  place-items: center;
  place-content: center;
  width: 40px;
  height: 40px;
  color: var(--color-text);
  flex-shrink: 0;
  z-index: 1;
}

h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-heading);
  letter-spacing: -0.01em;
}

.item :deep(a) {
  color: var(--vt-c-accent);
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.item :deep(a:hover) {
  background-color: rgba(66, 185, 131, 0.1);
  color: var(--vt-c-accent-hover);
}

@media (min-width: 1024px) {
  .item {
    margin-top: 0;
    padding: 1.2rem 1rem 1.5rem calc(var(--section-gap) / 2);
    background: transparent;
    border: none;
    box-shadow: none;
  }

  .item:hover {
    transform: none;
    box-shadow: none;
    border-color: transparent;
  }

  .item:hover::before {
    transform: scaleX(0);
  }

  i {
    top: calc(50% - 25px);
    left: -26px;
    position: absolute;
    border: 1px solid var(--color-border);
    background: var(--color-background);
    border-radius: 10px;
    width: 52px;
    height: 52px;
    box-shadow: var(--shadow-sm);
    transition: all 0.3s ease;
  }

  .item:hover i {
    border-color: var(--vt-c-accent);
    box-shadow: var(--shadow-md), 0 0 15px rgba(66, 185, 131, 0.2);
    transform: scale(1.05);
  }

  .item:before {
    content: ' ';
    border-left: 1px solid var(--color-border);
    position: absolute;
    left: 0;
    bottom: calc(50% + 25px);
    height: calc(50% - 25px);
    transition: border-color 0.3s ease;
  }

  .item:after {
    content: ' ';
    border-left: 1px solid var(--color-border);
    position: absolute;
    left: 0;
    top: calc(50% + 25px);
    height: calc(50% - 25px);
    transition: border-color 0.3s ease;
  }

  .item:hover:before,
  .item:hover:after {
    border-left-color: var(--vt-c-accent);
  }

  .item:first-of-type:before {
    display: none;
  }

  .item:last-of-type:after {
    display: none;
  }
}
</style>
