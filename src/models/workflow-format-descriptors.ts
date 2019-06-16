import {WorkflowFormatDescriptorDictionary} from "./workflow-format";

export const WorkflowFormatDescriptors: WorkflowFormatDescriptorDictionary = {
  json: {
    format: 'json',
    fileExtension: '.json',
    mimeType: 'application/json',
    displayName: 'JSON'
  },
  yaml: {
    format: 'yaml',
    fileExtension: '.yaml',
    mimeType: 'application/x-yaml',
    displayName: 'YAML'
  },
  xml: {
    format: 'xml',
    fileExtension: '.xml',
    mimeType: 'application/xml',
    displayName: 'XML'
  },
  object: {
    format: 'object',
    fileExtension: '.bin',
    mimeType: 'application/binary',
    displayName: 'Binary'
  }
};
