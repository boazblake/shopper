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
    let sortedTickets = tickets
      .map((ticket) => {
        ticket.issues = issues
          .filter(propEq("ticketId", ticket.id))
          .sort((a, b) => a.order - b.order)
        return ticket
      })
      .sort((a, b) => a.order - b.order)

    return {
      tickets: sortedTickets,
      projects: projects.map((project) => {
        project.tickets = sortedTickets
          .filter(propEq("projectId", project.id))
          .sort((a, b) => a.order - b.order)
        return project
      }),
      issues: issues,
    }
  }

  const onSuccess = ({ projects, tickets, issues }) => {
    mdl.projects = projects
    mdl.tickets = tickets
    mdl.issues = issues
    mdl.currentProject = loadProject(mdl)
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

export const ISSUE = (ticketId, order = 0) => ({
  id: uuid(),
  title: "",
  text: "",
  ticketId,
  order,
})
export const TICKET = (title, projectId, order = 0) => ({
  id: uuid(),
  title,
  order,
  projectId,
})
export const PROJECT = (title, order = 0) => ({
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

