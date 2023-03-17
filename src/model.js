import Task from "data.task"
import http from "./http"
import { log, uuid } from "./helpers"
import { propEq, sortBy } from "ramda"
import Stream from "mithril-stream"

const shortName = (mdl) => `${mdl.currentProject.title.slice(0, 3).toUpperCase()}-`

const findCurrentProject = (mdl) => mdl.projects.find(propEq("id", mdl.state.projectId))

const closeModal = mdl => {
  mdl.state.modalContent = null
  mdl.state.showModal = false
}

const openModal = ({ content, mdl, opts }) => {
  mdl.state.modalContent = { content, attrs: { mdl, ...opts } }
  mdl.state.showModal = true
}


const units = [
  'of them',
  'bag(s)',
  'box(s)',
  'can(s)',
  'gram(s)',
  'kilogram(s)',
  'pound(s)',
  'liter(s)',
  'mliter(s)',
  'ounce(s)'
]

const getCurrentStore = (mdl) =>
  mdl.stores.find(propEq("id", mdl.currentStore()?.id)) || mdl.stores[0]

const sortByOrder = sortBy(propEq('order'))

const load = (mdl) => {
  const getStoresTask = (mdl) => mdl.http.getTask(mdl, "stores")
  const getCatsTask = (mdl) => mdl.http.getTask(mdl, "cats")
  const getItemsTask = (mdl) => mdl.http.getTask(mdl, "items")

  const toViewModel = ({ stores, cats, items }) => {
    let sortedCats = cats
      .map((cat) => {
        cat.items = items
          .filter(propEq("catId", cat.id))
          .sort((a, b) => a.order - b.order)
        // .reverse()
        return cat
      })
      .sort((a, b) => a.order - b.order)
    return {
      cats: sortedCats,
      stores: sortByOrder(stores.map((store) => {
        store.cats = sortedCats
          .filter(propEq("storeId", store.id))
          .sort((a, b) => a.order - b.order)
        return store
      })),
      items: items,
    }
  }

  const onSuccess = ({ stores, cats, items }) => {
    mdl.stores = stores
    mdl.cats = cats
    mdl.items = items
    mdl.currentStore(getCurrentStore(mdl))
    // console.log('onsuccess stores', stores, mdl.currentStore().cats)
  }

  Task.of(
    (stores) => (cats) => (items) =>
      toViewModel({ stores, cats, items })
  )
    .ap(getStoresTask(mdl))
    .ap(getCatsTask(mdl))
    .ap(getItemsTask(mdl))
    .fork(log("error"), onSuccess)
}

const ITEM = ({ catId, title, notes, quantity, unit, price, order }) => ({
  id: uuid(),
  title,
  notes,
  catId,
  order,
  quantity,
  unit,
  price,
  notes,
  purchased: false,
})
const CAT = (title, storeId, order = 0) => ({
  id: uuid(),
  title,
  order,
  storeId,
  collapsed: false,
  dragCollapsed: false
})
const STORE = ({ title, order = 0 }) => ({
  title,
  id: uuid(),
  order,
})

const model = {
  state: {},
  http,
  settings: {},
  state: {
    dragItemList: {},
    dragCatList: {},
    dragging: {
      isDragging: false,
      item: "",
      swapItem: "",
    },
    catIds: [],
    items: [],
    showModal: false,
    modalContent: null,
  },
  stores: [],
  cats: [],
  items: [],
  currentStore: Stream(null),
}

export {
  units,
  sortByOrder,
  shortName,
  findCurrentProject,
  closeModal,
  openModal,
  getCurrentStore,
  load,
  ITEM,
  CAT,
  STORE,
}
export default model
