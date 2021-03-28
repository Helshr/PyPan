import React from 'react';
import { connect } from 'dva';
import { Upload, Button, Icon } from 'antd';

import { deepCopy } from '../../utils/utils';

class UploadFile extends React.Component {
  state = {
  };

  render() {
    const { fileInfoList } = this.props;
    return (
      <div>
        <Upload
           action='/api/uploadFile'
           listType='picture'
           fileList={fileInfoList}
           onRemove={file => console.log("will remove file: ", file)}
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
