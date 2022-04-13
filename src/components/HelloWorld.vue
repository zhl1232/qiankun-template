<template>
  <div class="change-locale">
    <span style="margin-right: 16px">Change locale of components:</span>
  </div>

  <div class="locale-components">
    <div class="example">
      <a-pagination :total="50" show-size-changer />
    </div>
    <div class="example">
      <a-select show-search style="width: 200px">
        <a-select-option value="jack">jack</a-select-option>
        <a-select-option value="lucy">lucy</a-select-option>
      </a-select>
      <a-date-picker />
      <a-time-picker />
      <a-range-picker style="width: 200px" />
    </div>
    <div class="example">
      <a-button type="primary" @click="visible = true">Show Modal</a-button>
      <a-button @click="info">Show info</a-button>
      <a-button @click="confirm">Show confirm</a-button>
      <a-popconfirm title="Question?">
        <a href="#">Click to confirm</a>
      </a-popconfirm>
    </div>
    <div class="example">
      <a-transfer :data-source="[]" show-search :target-keys="[]" :render="(item: any) => item.title" />
    </div>
    <div class="site-config-provider-calendar-wrapper">
      <a-calendar :fullscreen="false" />
    </div>
    <div class="example">
      <a-table :data-source="[]" :columns="columns" />
    </div>
    <a-modal v-model:visible="visible" title="Locale Modal">
      <p>Locale Modal</p>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { Modal } from "ant-design-vue"
// import { defineComponent, ref } from "vue"

// dayjs.locale("en")

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    filters: [
      {
        text: "filter1",
        value: "filter1"
      }
    ]
  },
  {
    title: "Age",
    dataIndex: "age"
  }
]

const visible = ref(false)
// const locale = ref(enUS.locale)
// watch(locale, val => {
//   dayjs.locale(val)
// })
const info = () => {
  Modal.info({
    title: "some info",
    content: "some info"
  })
}
const confirm = () => {
  Modal.confirm({
    title: "some info",
    content: "some info"
  })
}
</script>
<style scoped>
.site-config-provider-calendar-wrapper {
  width: 319px;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
}

.locale-components {
  padding-top: 16px;
  border-top: 1px solid #d9d9d9;
}

.example {
  margin: 16px 0;
}

.example > * {
  margin-right: 8px;
}

.change-locale {
  margin-bottom: 16px;
}

[data-theme="dark"] .locale-components {
  border-top: 1px solid #303030;
}

[data-theme="dark"] .site-config-provider-calendar-wrapper {
  border: 1px solid #303030;
}
</style>
