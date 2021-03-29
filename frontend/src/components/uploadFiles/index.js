import React from 'react';
import { connect } from 'dva';
import { Upload, Button, Icon } from 'antd';
import { print } from '../../utils/utils';

class UploadFile extends React.Component {
  state = {
  };

  deleteFile = (file) => {
    const fileMd5 = file['uid'];
    const { dispatch } = this.props;
    dispatch({
      type: "uploadFiles/deleteFile",
      payload: {
        fileMd5,
      }
    })
  }

  render() {
    const { fileInfoList } = this.props;
    return (
      <div>
        <Upload
           action='/api/uploadFile'
           listType='picture'
           fileList={fileInfoList}
           onDownload={file => print(`file: ${file}`)}
           onRemove={file => this.deleteFile(file)}
        >
            <Button>
                <Icon type="upload" /> Upload
            </Button>
        </Upload>
      </div>
    );
  }
}

function mapStateToProps(state) {
    const { formData, fileInfoList } = state.uploadFiles;
    return {
        formData,
        fileInfoList,
    }
}

export default connect(mapStateToProps)(UploadFile);
