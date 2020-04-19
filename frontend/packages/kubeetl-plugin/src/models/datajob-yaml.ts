import { Map as ImmutableMap } from 'immutable';
import { DataJobModel } from '.';

export const DataJobYAML = ImmutableMap().setIn(
  ['default'],
  `
  apiVersion: ${DataJobModel.apiGroup}/${DataJobModel.apiVersion}
  kind: ${DataJobModel.kind}
  metadata:
  name: example,
  namespace: 'default'
  data:
  example.json: |
    {
        "job": {
            "setting": {
              "speed": {
                  "byte": ''
                },
              "errorLimit": {
                "record": 0,
                "percentage": ''
              }
            },
            "content": [
                {
                    "reader": {
                        "name": "mysqlreader",
                        "parameter": {
                            "username": "",
                            "password": "",
                            column": "2",
                            "splitPk": "",
                            "where": "",
                            "querySql": "",
                            "fetchSize": 1024,
                            "connection": [
                                {
                                    "table": [],
                                    "jdbcUrl": []
                                }
                            ]
                        }
                    },
                    "writer": {
                        "name": "streamwriter",
                        "parameter": {
                            "print":false,
                            "encoding":"UTF-8"
                        }
                    }
                }
            ]
        }
    }
  `
);
