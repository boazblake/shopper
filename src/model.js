import Task from "data.task"
import http from "./http"
import { log, uuid } from "./helpers"
import { propEq } from "ramda"

export const loadProject = (mdl) =>
  mdl.projects.find(propEq("id", mdl.currentProject?.id)) || mdl.projects[0]

export const load = (mdl) => {
  const getProjectsTask = (mdl) => mdl.http.getTask(mdl, "projects")
  const getTicketsTask = (mdl) => mdl.http.getTask(mdl, "tickets")
  const getIssuesTask = (mdl) => mdl.http.getTask(mdl, "issues")

  const toViewModel = ({ projects, tickets, issues }) => {
    let sortedTickets = tickets.map((ticket) => {
      ticket.issues = issues.filter(propEq("ticketId", ticket.id))
      return ticket
    })

    return {
      tickets: sortedTickets,
      projects: projects.map((project) => {
        project.tickets = sortedTickets.filter(propEq("projectId", project.id))
        return project
      }),
      issues,
    }
  }

  const onSuccess = ({ projects, tickets, issues }) => {
    mdl.projects = projects
    mdl.tickets = tickets
    mdl.issues = issues
    mdl.currentProject = loadProject(mdl)
    console.log("loaded", mdl)
  }

  Task.of(
    (projects) => (tickets) => (issues) =>
      toViewModel({ projects, tickets, issues })
  )
    .ap(getProjectsTask(mdl))
    .ap(getTicketsTask(mdl))
    .ap(getIssuesTask(mdl))
    .fork(log("error"), onSuccess)
}

export const ISSUE = (ticketId) => ({
  id: uuid(),
  title: "",
  text: "",
  ticketId,
})
export const TICKET = (title, projectId) => ({
  id: uuid(),
  title,
  projectId,
  isSelected: false,
})
export const PROJECT = (title = "default") => ({
  title,
  id: uuid(),
})

// const defaultProject = () => PROJECT()

// const createDefaultProjectTask = (mdl, project) =>
//   mdl.http.postTask(mdl, "projects", project)

// const checkForProjectsTask = (mdl) => (xs) =>
//   isEmpty(xs) ? createDefaultProjectTask(mdl, defaultProject()) : Task.of(xs)

// const getTicketsByProjectId = (mdl) => (id) => mdl.http.getTask(mdl, "tickets")

// const checkForTicketsTask = (mdl) => (projects) => {
//   mdl.projects = projects
//   let projectIds = pluck("id", projects)
//   return traverse(Task.of, getTicketsByProjectId(mdl), projectIds)
// }

// const checkForIssuesTask = (mdl) => (projects) => {
//   mdl.projects = projects
//   let projectIds = pluck("id", projects)
//   return traverse(Task.of, getTicketsByProjectId(mdl), projectIds)
// }

// export const initDBTask = (mdl) =>
//   mdl.http
//     .getTask(mdl, "projects")
//     .chain(checkForProjectsTask(mdl))
//     .chain(checkForTicketsTask(mdl))
//     .chain(checkForIssuesTask(mdl))

const model = {
  state: {},
  http,
  settings: {},
  state: {
    dragging: {
      oldTicketId: "",
      issueId: "",
    },
    ticketIds: [],
    issues: [],
    showModal: false,
    modalContent: null,
  },
  projects: [],
  tickets: [],
  issues: [],
  currentProject: null,
}
export default model

