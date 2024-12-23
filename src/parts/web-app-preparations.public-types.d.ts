interface Window {
    webAppInitialPageBesideSpa_InitBeforeSpaMounting?: () => (void | Promise<void>);
    webAppInitialPageBesideSpa_DisposeAfterSpaMounted?: () => (void | Promise<void>);
}
