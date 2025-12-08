## Troubleshooting

### Hydration Mismatch with `useDisplay`

**Problem:** SSR hydration errors when using responsive composables.

**Solution:** Use a watcher with `onMounted`:

```vue
<script setup>
const { mobile } = useDisplay()
const isMobile = ref(false)

onMounted(() => {
  isMobile.value = mobile.value
  watch(mobile, (val) => {
    isMobile.value = val
  })
})
</script>
```

### Styles Not Loading

**Problem:** Vuetify components appear unstyled.

**Checklist:**
1.  Ensure `disableVuetifyStyles` is `false`
2. Check that `vuetify/styles` is in your CSS
3. Verify SASS is properly configured if using custom styles

### Labs Components Not Found

**Problem:** Components like `VDatePicker` throw errors.

**Solution:**
```typescript
vuetify: {
  autoImport: {
    labs: true  // Enable labs components
  }
}
```

### Icon Not Displaying

**Problem:** Icons show as empty boxes.

**Solution:** Ensure icon font is installed:
```bash
npm install @mdi/font
```

The module automatically adds the CSS for `@mdi/font` when using `mdi` icon set.
