import Task from "data.task"
import http from "./http"
import { log, uuid } from "./helpers"
import { propEq } from "ramda"


export const units = [
  'Of Them',
  'Boxe(s)',
  'Can(s)',
  'gram(s)',
  'kilogram(s)',
  'pound(s)',
  'liter(s)',
  'mliter(s)',
  'ounce(s)'
]

export const loadStore = (mdl) =>
  mdl.stores.find(propEq("id", mdl.currentStore?.id)) || mdl.stores[0]

export const load = (mdl) => {
  const getStoresTask = (mdl) => mdl.http.getTask(mdl, "stores")
  const getCatsTask = (mdl) => mdl.http.getTask(mdl, "cats")
  const getItemsTask = (mdl) => mdl.http.getTask(mdl, "items")

  const toViewModel = ({ stores, cats, items }) => {
    let sortedCats = cats
      .map((cat) => {
        cat.items = items
          .filter(propEq("catId", cat.id))
          .sort((a, b) => a.order - b.order)
          .reverse()
        return cat
      })
      .sort((a, b) => a.order - b.order)

    return {
      cats: sortedCats,
      stores: stores.map((store) => {
        store.cats = sortedCats
          .filter(propEq("storeId", store.id))
          .sort((a, b) => a.order - b.order)
        return store
      }),
      items: items,
    }
  }

  const onSuccess = ({ stores, cats, items }) => {
    mdl.stores = stores
    mdl.cats = cats
    mdl.items = items.reverse()
    mdl.currentStore = loadStore(mdl)
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

export const ITEM = ({ catId, title, notes, quantity, unit, price, order }) => ({
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
export const CAT = (title, storeId, order = 0) => ({
  id: uuid(),
  title,
  order,
  storeId,
  collapsed: false,
  dragCollapsed: false
})
export const STORE = (title, order = 0) => ({
  title,
  id: uuid(),
  order,
})

const model = {
  state: {},
  http,
  settings: {},
  state: {
    dragging: {
      isDragging: true,
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
  currentStore: null,
}
export default model

