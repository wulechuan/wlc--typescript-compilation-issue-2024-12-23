import pathTools from 'path'
import fs from 'fs'
import typescript, {
} from 'typescript'





export const assetsRootFolder_AbsPath = pathTools.resolve(__dirname)





function main () {
    compileAllTypescriptFiles()
}

main()





async function compileAllTypescriptFiles (): Promise<{
    readonly javascriptCode_FullText: string;
}> {
    const typescript_CompilerOptions: typescript.CompilerOptions = {
        module: typescript.ModuleKind.System,
        moduleResolution: typescript.ModuleResolutionKind.NodeNext,
        target: typescript.ScriptTarget.ES2019,
        declaration: false,
        sourceMap: false,
        traceResolution: false,
        allowUmdGlobalAccess: true,
    }





    const typescriptSourceFile1_AbsPath = pathTools.join(
        assetsRootFolder_AbsPath,
        'parts',
        'web-app-preparations.ts'
    )

    const typescriptSourceFile2_AbsPath = pathTools.join(
        assetsRootFolder_AbsPath,
        'parts',
        'web-app-preparations.public-types.d.ts'
    )





    let javascriptCode_FullText: string = ''





    if (!fs.existsSync(typescriptSourceFile1_AbsPath)) {
        throw new ReferenceError(`\nSource file not cound:\n    "${typescriptSourceFile1_AbsPath}"\n`)
    } else if (!fs.existsSync(typescriptSourceFile2_AbsPath)) {
        throw new ReferenceError(`\nSource file not cound:\n    "${typescriptSourceFile2_AbsPath}"\n`)
    } else {
        const shouldDeliberatelyInject_TypeDeclarations_Into_Source1 = false

        let   typeScript_SourceCode1_FullText = fs.readFileSync(typescriptSourceFile1_AbsPath, 'utf8')
        const typeScript_SourceCode2_FullText = fs.readFileSync(typescriptSourceFile2_AbsPath, 'utf8')

        if (shouldDeliberatelyInject_TypeDeclarations_Into_Source1) {
            typeScript_SourceCode1_FullText = `${typeScript_SourceCode2_FullText}${'\n'.repeat(5)}${typeScript_SourceCode1_FullText}`
        }

        const typescript_VirtualSourceFile1 = typescript.createSourceFile(
            typescriptSourceFile1_AbsPath,
            typeScript_SourceCode1_FullText,
            typescript.ScriptTarget.ES2019,
            true,
            typescript.ScriptKind.TS
        )

        let typescript_VirtualSourceFile2: undefined | typescript.SourceFile = undefined

        if (!shouldDeliberatelyInject_TypeDeclarations_Into_Source1) {
            typescript_VirtualSourceFile2 = typescript.createSourceFile(
                typescriptSourceFile2_AbsPath,
                typeScript_SourceCode2_FullText,
                typescript.ScriptTarget.ES2019,
                true,
                typescript.ScriptKind.TS
            )
        }





        const typescript_Program1 = typescript.createProgram(
            typescript_VirtualSourceFile2 ? [
                typescript_VirtualSourceFile2.fileName,
                typescript_VirtualSourceFile1.fileName,
            ] : [
                typescript_VirtualSourceFile1.fileName,
            ],

            typescript_CompilerOptions
        )

        const typescriptProgram1_AllInvovledSourceFiles = typescript_Program1.getSourceFiles()
        console.log(
            'typescript_Program1:',
            '\nAll invovled source files:', typescriptProgram1_AllInvovledSourceFiles.length,
            '\nsome interested files:',     typescriptProgram1_AllInvovledSourceFiles.filter(sf => sf.fileName.match(/[\\/]parts[\\/]/))
                // .map(sf => { const sf_Any = sf as any; return { resolvedPath: sf_Any.resolvedPath, packageJsonScope: sf_Any.packageJsonScope } })
            ,
            '\n'
        )





        const everythingEndSuccessfully = new Promise<void>(function (resolve, reject) {
            const typescript_CompliationTask1_Result = typescript_Program1.emit(
                typescript_VirtualSourceFile1,
                function (involvedFileName, javascriptCode_Text) {
                    if (javascriptCode_Text) {
                        javascriptCode_FullText += javascriptCode_Text
                    }
                }
            )

            console.log('typescript_CompliationTask1_Result:', typescript_CompliationTask1_Result, '\n')

            if (typescript_CompliationTask1_Result.emitSkipped) {
                reject()
            } else {
                resolve()
            }
        })

        await everythingEndSuccessfully

        console.log(`TypeScript compilation task on:\n    "${typescriptSourceFile1_AbsPath}"\nhas succeeded.\n`)
    }





    return {
        javascriptCode_FullText,
    }
}
