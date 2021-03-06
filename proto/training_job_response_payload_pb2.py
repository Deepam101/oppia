# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: training_job_response_payload.proto
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from google.protobuf import reflection as _reflection
from google.protobuf import symbol_database as _symbol_database
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()


import text_classifier_pb2 as text__classifier__pb2


DESCRIPTOR = _descriptor.FileDescriptor(
  name='training_job_response_payload.proto',
  package='',
  syntax='proto3',
  serialized_options=None,
  create_key=_descriptor._internal_create_key,
  serialized_pb=b'\n#training_job_response_payload.proto\x1a\x15text_classifier.proto\"\x9c\x02\n\x1aTrainingJobResponsePayload\x12\x44\n\njob_result\x18\x01 \x01(\x0b\x32%.TrainingJobResponsePayload.JobResultR\tjobResult\x12\x13\n\x05vm_id\x18\x02 \x01(\tR\x04vmId\x12\x1c\n\tsignature\x18\x03 \x01(\tR\tsignature\x1a\x84\x01\n\tJobResult\x12\x15\n\x06job_id\x18\x01 \x01(\tR\x05jobId\x12\x45\n\x0ftext_classifier\x18\x02 \x01(\x0b\x32\x1a.TextClassifierFrozenModelH\x00R\x0etextClassifierB\x19\n\x17\x63lassifier_frozen_modelb\x06proto3'
  ,
  dependencies=[text__classifier__pb2.DESCRIPTOR,])




_TRAININGJOBRESPONSEPAYLOAD_JOBRESULT = _descriptor.Descriptor(
  name='JobResult',
  full_name='TrainingJobResponsePayload.JobResult',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  create_key=_descriptor._internal_create_key,
  fields=[
    _descriptor.FieldDescriptor(
      name='job_id', full_name='TrainingJobResponsePayload.JobResult.job_id', index=0,
      number=1, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, json_name='jobId', file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='text_classifier', full_name='TrainingJobResponsePayload.JobResult.text_classifier', index=1,
      number=2, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, json_name='textClassifier', file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
    _descriptor.OneofDescriptor(
      name='classifier_frozen_model', full_name='TrainingJobResponsePayload.JobResult.classifier_frozen_model',
      index=0, containing_type=None,
      create_key=_descriptor._internal_create_key,
    fields=[]),
  ],
  serialized_start=215,
  serialized_end=347,
)

_TRAININGJOBRESPONSEPAYLOAD = _descriptor.Descriptor(
  name='TrainingJobResponsePayload',
  full_name='TrainingJobResponsePayload',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  create_key=_descriptor._internal_create_key,
  fields=[
    _descriptor.FieldDescriptor(
      name='job_result', full_name='TrainingJobResponsePayload.job_result', index=0,
      number=1, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, json_name='jobResult', file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='vm_id', full_name='TrainingJobResponsePayload.vm_id', index=1,
      number=2, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, json_name='vmId', file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='signature', full_name='TrainingJobResponsePayload.signature', index=2,
      number=3, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, json_name='signature', file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
  ],
  extensions=[
  ],
  nested_types=[_TRAININGJOBRESPONSEPAYLOAD_JOBRESULT, ],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=63,
  serialized_end=347,
)

_TRAININGJOBRESPONSEPAYLOAD_JOBRESULT.fields_by_name['text_classifier'].message_type = text__classifier__pb2._TEXTCLASSIFIERFROZENMODEL
_TRAININGJOBRESPONSEPAYLOAD_JOBRESULT.containing_type = _TRAININGJOBRESPONSEPAYLOAD
_TRAININGJOBRESPONSEPAYLOAD_JOBRESULT.oneofs_by_name['classifier_frozen_model'].fields.append(
  _TRAININGJOBRESPONSEPAYLOAD_JOBRESULT.fields_by_name['text_classifier'])
_TRAININGJOBRESPONSEPAYLOAD_JOBRESULT.fields_by_name['text_classifier'].containing_oneof = _TRAININGJOBRESPONSEPAYLOAD_JOBRESULT.oneofs_by_name['classifier_frozen_model']
_TRAININGJOBRESPONSEPAYLOAD.fields_by_name['job_result'].message_type = _TRAININGJOBRESPONSEPAYLOAD_JOBRESULT
DESCRIPTOR.message_types_by_name['TrainingJobResponsePayload'] = _TRAININGJOBRESPONSEPAYLOAD
_sym_db.RegisterFileDescriptor(DESCRIPTOR)

TrainingJobResponsePayload = _reflection.GeneratedProtocolMessageType('TrainingJobResponsePayload', (_message.Message,), {

  'JobResult' : _reflection.GeneratedProtocolMessageType('JobResult', (_message.Message,), {
    'DESCRIPTOR' : _TRAININGJOBRESPONSEPAYLOAD_JOBRESULT,
    '__module__' : 'training_job_response_payload_pb2'
    # @@protoc_insertion_point(class_scope:TrainingJobResponsePayload.JobResult)
    })
  ,
  'DESCRIPTOR' : _TRAININGJOBRESPONSEPAYLOAD,
  '__module__' : 'training_job_response_payload_pb2'
  # @@protoc_insertion_point(class_scope:TrainingJobResponsePayload)
  })
_sym_db.RegisterMessage(TrainingJobResponsePayload)
_sym_db.RegisterMessage(TrainingJobResponsePayload.JobResult)


# @@protoc_insertion_point(module_scope)
