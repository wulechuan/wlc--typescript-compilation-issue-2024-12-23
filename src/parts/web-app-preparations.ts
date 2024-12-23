window.webAppInitialPageBesideSpa_InitBeforeSpaMounting = function () {
    const vueSpa_RootDiv = document.querySelector(`#vue-app-root`)
    if (vueSpa_RootDiv instanceof HTMLDivElement) {
        vueSpa_RootDiv.style.display = 'none'
    }
}





window.webAppInitialPageBesideSpa_DisposeAfterSpaMounted = async function () {
    const initialPage_RootDiv = document.querySelector(`#initial-page-root`)
    const initialPage_ShouldHideIt = initialPage_RootDiv instanceof HTMLDivElement && !!initialPage_RootDiv.parentNode

    let cssTransitionsKnownMaxDuration_Milliseconds = 0

    if (initialPage_ShouldHideIt) {
        const cssClassName1 = 'is-hiding'
        if (!initialPage_RootDiv.classList.contains(cssClassName1)) {
             initialPage_RootDiv.classList.add     (cssClassName1)
        }
        cssTransitionsKnownMaxDuration_Milliseconds = 500
    }

    const vueSpa_RootDiv = document.querySelector(`#vue-app-root`)
    if (vueSpa_RootDiv instanceof HTMLDivElement) {
        vueSpa_RootDiv.style.display = ''
    }

    if (initialPage_ShouldHideIt) {
        if (cssTransitionsKnownMaxDuration_Milliseconds > 15) { // magic number `15`.
            await new Promise(resolve => setTimeout(resolve, cssTransitionsKnownMaxDuration_Milliseconds))
        }
        initialPage_RootDiv.parentNode.removeChild(initialPage_RootDiv)
    }

    delete window.webAppInitialPageBesideSpa_InitBeforeSpaMounting
    delete window.webAppInitialPageBesideSpa_DisposeAfterSpaMounted
}





if (typeof window.webAppInitialPageBesideSpa_InitBeforeSpaMounting === 'function') {
           window.webAppInitialPageBesideSpa_InitBeforeSpaMounting()
}
