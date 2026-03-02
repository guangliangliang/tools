<script setup lang="ts">
const icp = import.meta.env.VITE_ICP_NUMBER || "";
const publicSecurity = import.meta.env.VITE_PUBLIC_SECURITY_NUMBER || "";
// Optional custom link templates; if not provided a sensible default will be used
const icpLinkTemplate = import.meta.env.VITE_ICP_LINK || "";
const publicSecurityLinkTemplate =
  import.meta.env.VITE_PUBLIC_SECURITY_LINK || "";

function makeLink(template: string, number: string, defaultUrl: string) {
  if (template) {
    // allow placeholder {number}
    return template.replace("{number}", number);
  }
  return defaultUrl;
}

const icpLink = icp
  ? makeLink(icpLinkTemplate, icp, `https://beian.miit.gov.cn/`)
  : "";
const publicSecurityLink = publicSecurity
  ? makeLink(
      publicSecurityLinkTemplate,
      publicSecurity,
      `http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=${publicSecurity}`,
    )
  : "";
</script>

<template>
  <footer class="site-footer" v-if="icp || publicSecurity">
    <div class="footer-content">
      <span v-if="icp">
        <a :href="icpLink" target="_blank" rel="noopener">京ICP备{{ icp }}号</a>
      </span>
      <span v-if="publicSecurity" class="separator">
        |
        <a :href="publicSecurityLink" target="_blank" rel="noopener"
          >京公网安备{{ publicSecurity }}号</a
        >
      </span>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  width: 100%;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.9);
  text-align: center;
  font-size: 0.75rem;
  color: #64748b;
  flex-shrink: 0;
  border-top: 1px solid rgba(148, 163, 184, 0.2);
}

@media (prefers-color-scheme: dark) {
  .site-footer {
    background: rgba(30, 41, 59, 0.9);
    color: #94a3b8;
    border-top: 1px solid rgba(148, 163, 184, 0.1);
  }
}

.separator {
  margin: 0 0.25rem;
}
</style>
