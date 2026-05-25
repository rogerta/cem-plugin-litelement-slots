import { Parser } from "htmlparser2"

export default function myPlugin() {
  return {
    name: 'cem-plugin-litelement-slots',

    analyzePhase({ts, node, _, context}) {
      // The filename is used to build a unique key in the context to store
      // slot information.  This information is then used in moduleLinkPhase()
      // to create the slot properties in the manifest.
      const filename = node.getSourceFile()?.fileName

      switch (node.kind) {
        case ts.SyntaxKind.ClassDeclaration:
          // A class declaration is expected to happen before an html
          // template string.  Save a unique string to hold the slots for the
          // last class processed.
          const key = `${filename}:${node.name?.getText()}:slots`
          context.lastClassSlotsKey = key
          break

        case ts.SyntaxKind.TaggedTemplateExpression:
          if (!context.lastClassSlotsKey) {
            if (context.dev) {
              console.log(`${filename}: An html template string appears before the first class in the file.  To include it automatically move it to after the class.`)
            }
            break
          }

          // If this is not an html template string, just ignore.
          if (node.tag?.getText() !== 'html') {
            break
          }

          // htmlparser2 seems to have trouble parsing multiline comments, so
          // replace all newlines with spaces.  Below, runs of multiple spaces
          // will be coalecsed.
          const template = node.template?.getText().slice(1, -1)
                  .replaceAll('\n', ' ')
          if (!template) {
            if (context.dev) {
              console.log(`${filename}: An html template is empty.`)
            }
            break
          }

          // All the slots declared in the component accumulate here while
          // parsing.  Once the parsing is complete, the slots are transferred
          // to the context.
          let slots = []

          // all comments for a slot accumulate here while parsing.  Once the
          // parsing is complete, the comments are transferred to an entry in
          // `slots`.
          let comments = []

          const parser = new Parser({
            onopentag(tagName, attributes) {
              if (tagName === 'slot') {
                // If the slot is un-named, use a blank string in its place.
                const name = attributes.name ?? ''
                // Remove runs of spaces.
                const description = comments?.join(' ').replace(/ +/g, ' ')

                slots.push({name, description})
              }

              // Always clear the comments.  We are only looking for comments
              // that come right before the <slot>.
              comments = []
            },
            oncomment(text) {
              comments.push(text.trim())
            }
          })
          parser.write(template)
          parser.end()

          // Add the slots to the context.  At module link time, each class
          // will update it's module document with the correct slot info.
          if (slots.length > 0) {
            let contextSlotsRef = context[context.lastClassSlotsKey] || []
            contextSlotsRef = contextSlotsRef.concat(slots)
            context[context.lastClassSlotsKey] = contextSlotsRef
          }
          break
      }
    },

    moduleLinkPhase({moduleDoc, context}) {
      moduleDoc.declarations
          .filter(decl => decl.kind === 'class')
          .map(decl => {
            const key = `${moduleDoc.path}:${decl.name}:slots`
            if (context[key]) {
              decl.slots = decl.slots || []
              decl.slots = decl.slots.concat(context[key])
            }
          })
    },

    initialize({ts, customElementsManifest, context}) {},
    collectPhase({ts, node, context}){},
    packageLinkPhase({customElementsManifest, context}){},
  }
}
