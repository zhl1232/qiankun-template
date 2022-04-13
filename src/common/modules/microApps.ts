type microApp = {
  name: string
  entry: string
  container: '#view-main'
  activeRule: string
  port: number | string
}

const apps: microApp[] = [
  {
    "name": "dashboard",
    "entry": "//localhost:10001",
    "container": "#view-main",
    "activeRule": "/dashboard",
    "port": "10001"
  },
  {
    "name": "resource",
    "entry": "//localhost:10002",
    "container": "#view-main",
    "activeRule": "/resource",
    "port": "10002"
  },
  {
    "name": "test",
    "entry": "//localhost:10003",
    "container": "#view-main",
    "activeRule": "/test",
    "port": "10003"
  }
]
export default apps