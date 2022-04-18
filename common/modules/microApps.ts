type microApp = {
  name: string
  entry: string
  container: "#view-main"
  activeRule: string
  port: number | string
}

const apps: microApp[] = [
  {
    "name": "app1",
    "entry": "//localhost:10001",
    "container": "#view-main",
    "activeRule": "/app1",
    "port": "10001"
  },
  {
    "name": "app2",
    "entry": "//localhost:10002",
    "container": "#view-main",
    "activeRule": "/app2",
    "port": "10002"
  }
] 
 export default apps
