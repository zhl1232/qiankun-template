import deepwebConf from "./deepweb.yaml"
import fauthsConf from "./fauths.yaml"
import eniacConf from "./eniac.yaml"
import managerConf from "./manager.yaml"
import analysisConf from "./analysis.yaml"
import talkerConf from "./talker.yaml"
import reportConf from "./report.yaml"
import resourceConf from "./resource.yaml"
import aclController from "./acl-controller.yaml"
import elasticsearch from "./elasticsearch.yaml"
import alarm from "./alarm.yaml"
import baseline from "./baseline.yaml"
import genesis from "./genesis.yaml"
import fuser from "./fuser.yaml"
import pcap from "./pcap.yaml"
import diagnose from "./diagnose.yaml"
import digraph from "./digraph.yaml"
import monitor from "./monitor.yaml"
import painter from "./painter.yaml"
import statistics from "./statistics.yaml"
import warrant from "./warrant.yaml"
import webtools from "./webtools.yaml"

export default {
  ...deepwebConf,
  ...fauthsConf,
  ...eniacConf,
  ...managerConf,
  ...analysisConf,
  ...talkerConf,
  ...reportConf,
  ...resourceConf,
  ...aclController,
  ...elasticsearch,
  ...alarm,
  ...baseline,
  ...genesis,
  ...fuser,
  ...pcap,
  ...diagnose,
  ...digraph,
  ...monitor,
  ...painter,
  ...statistics,
  ...warrant,
  ...webtools
}
