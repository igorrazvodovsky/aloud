<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";
import IconClose from "@/components/icons/IconClose.vue";

const { label, variant = "panel" } = defineProps<{
  label: string;
  variant?: "panel" | "full";
}>();

const open = defineModel<boolean>({ required: true });

const el = ref<HTMLDialogElement | null>(null);

watch(open, (isOpen) => {
  const dialog = el.value;
  if (!dialog) return;
  // showModal() is what puts the dialog in the top layer, traps focus and
  // wires up Esc — none of which a div can do.
  if (isOpen && !dialog.open) dialog.showModal();
  else if (!isOpen && dialog.open) dialog.close();
});

function onClose() {
  open.value = false;
}

/**
 * Light dismiss. `closedby="any"` handles this natively; Safari does not
 * support it yet, so fall back to a backdrop hit-test.
 */
function onClick(event: MouseEvent) {
  const dialog = el.value;
  if (!dialog || "closedBy" in HTMLDialogElement.prototype) return;
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  const insideContent =
    rect.top <= event.clientY &&
    event.clientY <= rect.bottom &&
    rect.left <= event.clientX &&
    event.clientX <= rect.right;
  if (!insideContent) dialog.close();
}

onBeforeUnmount(() => {
  if (el.value?.open) el.value.close();
});
</script>

<template>
  <dialog
    ref="el"
    class="dialog"
    :class="`dialog--${variant}`"
    closedby="any"
    :aria-label="label"
    @close="onClose"
    @click="onClick"
  >
    <div class="dialog__bar">
      <button type="button" class="icon-button" aria-label="Close" @click="onClose">
        <IconClose />
      </button>
    </div>
    <div class="dialog__body">
      <slot />
    </div>
  </dialog>
</template>

<style scoped>
.dialog {
  padding: 0;
  border: 0;
  color: var(--ink);
  background: var(--paper);
  overflow: hidden;
}

/* Only lay the dialog out when it is actually open — otherwise this rule
   overrides the user-agent's `dialog:not([open]) { display: none }`. */
.dialog[open] {
  display: flex;
  flex-direction: column;
}

.dialog::backdrop {
  background: color-mix(in srgb, black 45%, transparent);
}

.dialog--full {
  inline-size: 100vw;
  max-inline-size: 100vw;
  block-size: 100dvh;
  max-block-size: 100dvh;
}

.dialog--panel {
  inline-size: min(32rem, calc(100vw - 2rem));
  max-block-size: min(40rem, calc(100dvh - 4rem));
  border-radius: 0.5rem;
  margin: auto;
  box-shadow: 0 1.5rem 3rem color-mix(in srgb, black 30%, transparent);
}

.dialog__bar {
  display: flex;
  justify-content: flex-end;
  padding: 0.75rem;
  flex: none;
}

.dialog__body {
  overflow-y: auto;
  padding: 0 1.5rem 2rem;
}
</style>
