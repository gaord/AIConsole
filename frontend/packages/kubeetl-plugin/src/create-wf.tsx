import * as _ from 'lodash-es';
import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ActionGroup, Button } from '@patternfly/react-core';
import { k8sCreate, K8sResourceKind, referenceFor, k8sGet } from '@console/internal/module/k8s';
import {
    ButtonBar,
    history,
    resourceObjPath,
    ListDropdown
} from '@console/internal/components/utils';
import { DataJobModel, DatabaseSourceModel, WorkFlowModel } from './models/index';
import { ConfigMapModel } from '@console/internal/models/index';
import { namespace } from 'd3';
import FormSection from '@console/dev-console/src/components/import/section/FormSection';
import update from 'immutability-helper';
import { useMachine } from '@xstate/react';
import { Machine,interpret } from 'xstate';
export const CreateDJ = (props) => {
    return <CreateDJPage namespace={props.match.params.ns} />;
};

const lightMachine = Machine({
    id: 'light',
    initial: 'green',
    states: {
      green: {
        on: {
          TIMER: 'yellow'
        }
      },
      yellow: {
        on: {
          TIMER: 'red'
        }
      },
      red: {
        on: {
          TIMER: 'green'
        }
      }
    }
  });
  
const currentState = 'green';

const nextState = lightMachine.transition(currentState, 'TIMER').value

const lightService = interpret(lightMachine);


const promiseMachine = Machine({
    id: 'promise',
    initial: 'pending',
    states: {
      pending: {
        on: {
          RESOLVE: 'resolved',
          REJECT: 'rejected'
        }
      },
      resolved: {
        type: 'final'
      },
      rejected: {
        type: 'final'
      }
    }
  });
  
class CreateDJPage extends React.Component<CreateDJPageProps, CreateDJPageState> {
    state = {
        error: '',
        inProgress: false,
        title: 'Create WorkFlow',
        djObj: null,
        cmObj: null,
        value: 'green',
        currentState: 'green'
    };
    componentDidMount() {
        if (location.href.indexOf("form") > -1) {
            document.querySelector(".co-namespace-bar").style.display = 'none';
        }
        const promiseService = interpret(promiseMachine).onTransition(state =>
        console.log(state.value)
        );
        promiseService.start();
        promiseService.send('RESOLVE');""
        console.log("执行")
    }
    
    render() {
        const { title} = this.state;
        const { namespace } = this.props;
        // const [state, send] = useMachine(lightMachine);
        // const [state, currentState] = useMachine(lightMachine);
        return (
            <div className="co-m-pane__body co-m-pane__form">
                <Helmet>
                    <title>{title}</title>
                </Helmet>
                <h1 className="co-m-pane__heading co-m-pane__heading--baseline">
                    <div className="co-m-pane__name">
                        {title}
                    </div>
                    <div className="co-m-pane__heading-link">
                        <Link to={`/k8s/ns/${namespace}/datajobs/~new`} id="yaml-link" replace>Edit YAML</Link>
                    </div>
                </h1>
                <div className="">展示</div>
                <div data-id="light" data-key="light" data-type="machine compound"></div>
                <div data-id="promise" id="promise"></div>
                
            </div>
        );
    }
}

export class CreateDJForm extends React.Component<CreateDJFormProps, CreateDJFormState> {

    

    render() {
        // const [currentState] = useMachine(lightMachine);
        return (
            <div>
            <React.Fragment>
                <div className="com-form-wrap">
                    <FormSection title="通用设置">
                        <label className="control-label co-required" htmlFor="configmap-name">
                            ConfigMap名称
                        </label>
                    </FormSection>
                </div>
                <div id="light"></div>
            </React.Fragment> 
             
           </div>
        );
       
    }
};

type connection = {
    table: string[];
    jdbcUrl: string[];
};
type Job = {
    setting: {
        speed: {
            channel: number;
            byte: number;
        };
        errorLimit: {
            record: number;
            percentage: number;
        };
    };
    content: {
        reader: {
            name: string;
            parameter: {
                username: string;
                password: string;
                column: string[];
                splitPk: string;
                where: string;
                querySql: string;
                fetchSize: number;
                session: string[];
                connection: connection[];
            };
        };
        writer: {
            name: string;
            parameter: {
                username: string;
                password: string;
                column: string[];
                preSql: string;
                postSql: string;
                batchSize: number;
                session: string[];
                writeMode: string
                connection: connection[];
            }
        };
    };
};


export type CreateDJFormProps = {
    namespace: string;
    onChange: Function;
};
export type CreateDJFormState = {
    configmapName: string;
    job: Job;
    showTable: boolean;
    // srcDbs: K8sResourceKind;
    // dstDbs: K8sResourceKind;
};

export type CreateDJPageProps = {
    namespace: string;
};

export type CreateDJPageState = {
    inProgress: boolean;
    error: string;
    title: string;
    djObj: K8sResourceKind;
    cmObj: K8sResourceKind;
    showTable: true;
};