import * as React from 'react';
import { connect } from 'react-redux';
import { NavItemSeparator } from '@patternfly/react-core';

import { featureReducerName } from '../../reducers/features';
import { FLAGS } from '../../const';
import { monitoringReducerName, MonitoringRoutes } from '../../reducers/monitoring';

import {
  BuildConfigModel,
  BuildModel,
  ChargebackReportModel,
  ClusterServiceVersionModel,
  // DeploymentConfigModel,
  ImageStreamModel,
  MachineAutoscalerModel,
  MachineConfigModel,
  MachineConfigPoolModel,
  MachineModel,
  MachineSetModel,
} from '../../models';

import { referenceForModel } from '../../module/k8s';
import { ExternalLink, HrefLink, ResourceNSLink, ResourceClusterLink } from './items';
import { NavSection } from './section';
import { formatNamespacedRouteForResource } from '../../actions/ui';

type SeparatorProps = {
  required?: string;
}
// Wrap `NavItemSeparator` so we can use `required` without prop type errors.
const Separator: React.FC<SeparatorProps> = () => <NavItemSeparator />;
// 注释
// const searchStartsWith = ['search'];
const provisionedServicesStartsWith = ['serviceinstances', 'servicebindings'];
const brokerManagementStartsWith = ['clusterservicebrokers', 'clusterserviceclasses'];
const rolesStartsWith = ['roles', 'clusterroles'];
const rolebindingsStartsWith = ['rolebindings', 'clusterrolebindings'];
const quotaStartsWith = ['resourcequotas', 'clusterresourcequotas'];
const imagestreamsStartsWith = ['imagestreams', 'imagestreamtags'];
const monitoringAlertsStartsWith = ['monitoring/alerts', 'monitoring/alertrules', 'monitoring/silences', 'monitoring/alertmanageryaml'];
const clusterSettingsStartsWith = ['settings/cluster', 'settings/idp', 'config.openshift.io'];
const meteringStartsWith = ['metering.openshift.io'];
// 注释
// const apiExplorerStartsWith = ['api-explorer', 'api-resource'];

const monitoringNavSectionStateToProps = (state) => ({
  canAccess: !!state[featureReducerName].get(FLAGS.CAN_GET_NS),
  grafanaURL: state[monitoringReducerName].get(MonitoringRoutes.Grafana),
  kibanaURL: state[monitoringReducerName].get(MonitoringRoutes.Kibana),
});

const MonitoringNavSection_ = ({grafanaURL, canAccess, kibanaURL}) => {
  const showAlerts = canAccess && !!window.SERVER_FLAGS.prometheusBaseURL;
  const showSilences = canAccess && !!window.SERVER_FLAGS.alertManagerBaseURL;
  const showGrafana = canAccess && !!grafanaURL;
  return showAlerts || showSilences || showGrafana || kibanaURL
    ? <NavSection title="Monitoring">
      {showAlerts && <HrefLink href="/monitoring/alerts" name="Alerting" startsWith={monitoringAlertsStartsWith} />}
      {showAlerts && <HrefLink href="/monitoring/query-browser?query0=" name="Metrics" />}
      {showGrafana && <ExternalLink href={grafanaURL} name="Dashboards" />}
      {kibanaURL && <ExternalLink href={kibanaURL} name="Logging" />}
    </NavSection>
    : null;
};
const MonitoringNavSection = connect(monitoringNavSectionStateToProps)(MonitoringNavSection_);

const AdminNav = () => (
  <React.Fragment>
    <NavSection title="工作区">
      <HrefLink href="/dashboards" activePath="/dashboards/" name="Dashboards" required={FLAGS.CAN_LIST_NS} />
      <HrefLink href="/catalog/all-namespaces" activePath="/catalog/all-namespaces" name="开发者目录" required={FLAGS.CAN_LIST_NS} />
      {/* <ResourceClusterLink resource="projects" name="Projects" required={FLAGS.OPENSHIFT} />
      <HrefLink href="/search" name="Search" startsWith={searchStartsWith} />
      <HrefLink href="/api-explorer" name="Explore" startsWith={apiExplorerStartsWith} />
      <ResourceNSLink resource="events" name="Events" /> */}
    </NavSection> 
    <NavSection title="开发">
      <HrefLink href="/cluster-settings/webide" activePath="/cluster-settings/webide" name="webide" required={FLAGS.CAN_LIST_NS} />
    </NavSection>
    <NavSection title="Operators" required={FLAGS.OPERATOR_LIFECYCLE_MANAGER}>
      <HrefLink
        required={[FLAGS.CAN_LIST_PACKAGE_MANIFEST, FLAGS.CAN_LIST_OPERATOR_GROUP]}
        href="/operatorhub"
        name="OperatorHub"
        activePath="/operatorhub/"
      />
      <ResourceNSLink
        model={ClusterServiceVersionModel}
        resource={ClusterServiceVersionModel.plural}
        name="Installed Operators"
      />
    </NavSection>

    <NavSection title="工作负载">
      <ResourceNSLink resource="pods" name="Pods" />
      <ResourceNSLink resource="virtualmachines" name="虚拟机" />
      <ResourceNSLink resource="virtualmachineinstances" name="虚拟机事件" />
      <ResourceNSLink resource="deployments" name="部署" />
      <ResourceNSLink resource="deploymentconfigs" name='部署配置' required={FLAGS.OPENSHIFT} />
      <ResourceNSLink resource="statefulsets" name="状态集" />
      <ResourceNSLink resource="secrets" name="秘密" />
      <ResourceNSLink resource="configmaps" name="配置映射" />
      <Separator />
      <ResourceNSLink resource="cronjobs" name="定时任务" />
      <ResourceNSLink resource="jobs" name="工作" />
      <ResourceNSLink resource="daemonsets" name="守护程序集" />
      <ResourceNSLink resource="replicasets" name="副本集" />
      <ResourceNSLink resource="replicationcontrollers" name="复制控制器" />
      <ResourceNSLink resource="horizontalpodautoscalers" name="水平自动扩展" />
      <ResourceNSLink resource="databasesources" name="数据库源" />
      <ResourceNSLink resource="datajobs" name="数据作业" />
      <ResourceNSLink resource="workflows" name="数据流" />
    </NavSection>

    { /* Temporary addition of Knative Serverless section until extensibility allows for section ordering
         and admin-nav gets contributed through extensions. */ }
    <NavSection title="Serverless" />

    <NavSection title="联网">
      <ResourceNSLink resource="services" name="Services" />
      <ResourceNSLink resource="routes" name="Routes" required={FLAGS.OPENSHIFT} />
      <ResourceNSLink resource="ingresses" name="Ingresses" />
      <ResourceNSLink resource="networkpolicies" name="Network Policies" />
    </NavSection>

    <NavSection title="存储">
      <ResourceClusterLink resource="persistentvolumes" name="Persistent Volumes" required={FLAGS.CAN_LIST_PV} />
      <ResourceNSLink resource="persistentvolumeclaims" name="Persistent Volume Claims" />
      <ResourceClusterLink resource="storageclasses" name="Storage Classes" />
    </NavSection>

    <NavSection title="build" required={FLAGS.OPENSHIFT}>
      <ResourceNSLink resource="buildconfigs" name={BuildConfigModel.labelPlural} />
      <ResourceNSLink resource="builds" name={BuildModel.labelPlural} />
      <ResourceNSLink resource="imagestreams" name={ImageStreamModel.labelPlural} startsWith={imagestreamsStartsWith} />
    </NavSection>

    <NavSection title="服务目录" required={FLAGS.SERVICE_CATALOG}>
      <HrefLink
        href="/provisionedservices"
        name="Provisioned Services"
        activePath="/provisionedservices/"
        startsWith={provisionedServicesStartsWith}
      />
      <HrefLink
        href="/brokermanagement"
        name="Broker Management"
        activePath="/brokermanagement/"
        startsWith={brokerManagementStartsWith}
      />
    </NavSection>

    <MonitoringNavSection />

    <NavSection title="Compute" required={FLAGS.CAN_LIST_NODE}>
      <ResourceClusterLink resource="nodes" name="Nodes" />
      <HrefLink href={formatNamespacedRouteForResource(referenceForModel(MachineModel), 'openshift-machine-api')}
        name="Machines"
        required={FLAGS.CLUSTER_API} />
      <HrefLink href={formatNamespacedRouteForResource(referenceForModel(MachineSetModel), 'openshift-machine-api')}
        name="Machine Sets"
        required={FLAGS.CLUSTER_API} />
      <HrefLink href={formatNamespacedRouteForResource(referenceForModel(MachineAutoscalerModel), 'openshift-machine-api')}
        name="Machine Autoscalers"
        required={FLAGS.MACHINE_AUTOSCALER} />
      <Separator required={FLAGS.MACHINE_CONFIG} />
      <ResourceClusterLink resource={referenceForModel(MachineConfigModel)} name="Machine Configs" required={FLAGS.MACHINE_CONFIG} />
      <ResourceClusterLink resource={referenceForModel(MachineConfigPoolModel)} name="Machine Config Pools" required={FLAGS.MACHINE_CONFIG} />
    </NavSection>

    <NavSection title="管理">
      <HrefLink href="/settings/cluster" activePath="/settings/cluster/" name="Cluster Settings" required={FLAGS.CLUSTER_VERSION} startsWith={clusterSettingsStartsWith} />
      <ResourceClusterLink resource="namespaces" name="Namespaces" required={FLAGS.CAN_LIST_NS} />
      <ResourceNSLink resource="serviceaccounts" name="Service Accounts" />
      <ResourceNSLink resource="roles" name="Roles" startsWith={rolesStartsWith} />
      <ResourceNSLink resource="rolebindings" name="Role Bindings" startsWith={rolebindingsStartsWith} />
      <ResourceNSLink resource="resourcequotas" name="Resource Quotas" startsWith={quotaStartsWith} />
      <ResourceNSLink resource="limitranges" name="Limit Ranges" />
      <HrefLink href={formatNamespacedRouteForResource(referenceForModel(ChargebackReportModel), 'openshift-metering')}
        name="Chargeback"
        required={[FLAGS.CHARGEBACK, FLAGS.CAN_LIST_CHARGEBACK_REPORTS]}
        startsWith={meteringStartsWith} />
      <ResourceClusterLink resource="customresourcedefinitions" name="Custom Resource Definitions" required={FLAGS.CAN_LIST_CRD} />
    </NavSection>
  </React.Fragment>
);

export default AdminNav;
