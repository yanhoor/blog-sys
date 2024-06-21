<template>
  <div class="tinymce-container" :style="{ width }">
    <textarea :id="tinymceId" ref="elRef"></textarea>
  </div>
</template>

<script lang="ts" setup>
import type { Editor, RawEditorSettings } from 'tinymce'
import tinymce from 'tinymce/tinymce'
import 'tinymce/themes/silver'
import 'tinymce/icons/default/icons'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/autosave'
import 'tinymce/plugins/code'
import 'tinymce/plugins/codesample'
import 'tinymce/plugins/directionality'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/hr'
// import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/link'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/media'
import 'tinymce/plugins/nonbreaking'
import 'tinymce/plugins/noneditable'
import 'tinymce/plugins/pagebreak'
import 'tinymce/plugins/paste'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/print'
import 'tinymce/plugins/save'
import 'tinymce/plugins/searchreplace'
// import 'tinymce/plugins/spellchecker';
import 'tinymce/plugins/tabfocus'
import 'tinymce/plugins/table'
import 'tinymce/plugins/template'
import 'tinymce/plugins/textpattern'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/visualchars'
import 'tinymce/plugins/wordcount'

const plugins = [
  'advlist anchor autolink table autosave code codesample  directionality  fullscreen hr link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace tabfocus  template  textpattern visualblocks visualchars wordcount'
]

const toolbar = [
  'fontsizeselect lineheight table searchreplace bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript code codesample',
  'hr bullist numlist link  preview anchor pagebreak media  forecolor backcolor fullscreen'
]

interface Props {
  options?: PropType<Partial<RawEditorSettings>>
  value?: string
  // toolbar: string[]
  // plugins: string[]
  height?: string
  width?: string
}
const modelValue = defineModel({ default: '' })
const props = withDefaults(defineProps<Props>(), {
  options: () => ({}),
  value: '',
  // toolbar: () => toolbar,
  // plugins: () => plugins,
  height: '400px',
  width: 'auto'
})

const colorMode = useColorMode()
const skinName = computed(() => {
  return colorMode.value === 'dark' ? 'oxide-dark' : 'oxide'
})
const tinymceId = ref('')
const editorRef = ref<Editor>()
const elRef = ref<HTMLElement>()
const emits = defineEmits(['inited', 'init-error'])

const initOptions = computed((): RawEditorSettings => {
  const { height, options } = props
  const publicPath = '/blog'
  return {
    selector: `#${unref(tinymceId)}`,
    browser_spellcheck: true,
    height,
    toolbar,
    entity_encoding: 'raw', // 禁用自动编码
    menubar: 'file edit insert view format table',
    plugins,
    contextmenu: '',
    language_url: publicPath + '/tinymce/langs/zh_CN.js',
    language: 'zh_CN',
    branding: false,
    default_link_target: '_blank',
    link_title: false,
    object_resizing: false,
    auto_focus: true,
    skin: skinName.value,
    valid_elements: '*[*]',
    valid_children: '*[*]',
    extended_valid_elements: 'style,link[href|rel],script',
    custom_elements: 'style,link,~link,script',
    content_style:
      'td::before {content: "";display: inline-block;height: 1px;width: 0;visibility: hidden;} img {margin: 0;padding: 0;}img {max-width: 100%;vertical-align: middle;}video {vertical-align: middle;}a {text-decoration: underline;} table, table tr, table td {border: 1px solid;text-align: center; } ul { list-style-type: disc;} ol {list-style-type: decimal;}',
    skin_url: publicPath + '/tinymce/skins/ui/' + skinName.value,
    content_css:
      publicPath + '/tinymce/skins/ui/' + skinName.value + '/content.min.css',
    ...options,
    setup: (editor: Editor) => {
      editorRef.value = editor
      editor.on('init', (e) => {
        const editor = unref(editorRef)
        if (!editor) {
          return
        }
        const value = modelValue.value || ''

        editor.on('change keyup undo redo', () => {
          modelValue.value = editor.getContent()
        })

        editor.setContent(value)
      })
      editor.on('PostRender', () => {
        const container = editor.getContainer()
        const uiContainer = document.querySelector(
          'body > .tox.tox-tinymce-aux'
        )
        container.parentNode.appendChild(uiContainer)
      })
    }
  } as RawEditorSettings
})

onMounted(() => {
  handleInitEditor()
})

onActivated(() => {
  handleInitEditor()
})

onDeactivated(() => {
  handleDestroyEditor()
})

onBeforeUnmount(() => {
  handleDestroyEditor()
})

function handleInitEditor() {
  handleGenerateId()
  setTimeout(() => {
    initEditor()
  }, 30)
}

function handleGenerateId() {
  const random = Math.floor(Math.random() * 1000000000)
  tinymceId.value =
    'tinyMce_' + new Date().getTime().toString() + random.toString()
}

function initEditor() {
  const el = unref(elRef)
  if (el) {
    el.style.visibility = ''
  }
  tinymce
    .init(unref(initOptions))
    .then((editor) => {
      emits('inited', editor)
    })
    .catch((err) => {
      emits('init-error', err)
    })
}

function handleDestroyEditor() {
  if (tinymce !== null) {
    tinymce?.remove?.(unref(initOptions).selector!)
  }
}
</script>

<style lang="postcss" scoped>
.tinymce-container {
  position: relative;
  line-height: normal;

  textarea {
    z-index: -1;
    visibility: hidden;
  }
}

.tox {
  .tox-menu {
    z-index: 99999 !important;
  }
}
</style>
