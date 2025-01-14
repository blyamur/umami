import { useContext, useRef } from 'react';
import { useMessages } from 'hooks';
import {
  Icon,
  Form,
  FormButtons,
  FormInput,
  FormRow,
  PopupTrigger,
  Popup,
  SubmitButton,
  Text,
  TextField,
  TooltipPopup,
} from 'react-basics';
import Icons from 'components/icons';
import UrlAddForm from './UrlAddForm';
import { ReportContext } from 'components/pages/reports/Report';
import styles from './FunnelParameters.module.css';
import BaseParameters from '../BaseParameters';

export function FunnelParameters() {
  const { report, runReport, updateReport, isRunning } = useContext(ReportContext);
  const { formatMessage, labels } = useMessages();
  const ref = useRef(null);

  const { parameters } = report || {};
  const { websiteId, dateRange, urls } = parameters || {};
  const queryDisabled = !websiteId || !dateRange || urls?.length < 2;

  const handleSubmit = data => {
    if (!queryDisabled) {
      runReport(data);
    }
  };

  const handleAddUrl = url => {
    updateReport({ parameters: { urls: parameters.urls.concat(url) } });
  };

  const handleRemoveUrl = (index, e) => {
    e.stopPropagation();
    const urls = [...parameters.urls];
    urls.splice(index, 1);
    updateReport({ parameters: { urls } });
  };

  return (
    <Form ref={ref} values={parameters} onSubmit={handleSubmit}>
      <BaseParameters />
      <FormRow label={formatMessage(labels.window)}>
        <FormInput
          name="window"
          rules={{ required: formatMessage(labels.required), pattern: /[0-9]+/ }}
        >
          <TextField autoComplete="off" />
        </FormInput>
      </FormRow>
      <FormRow label={formatMessage(labels.urls)} action={<AddUrlButton onAdd={handleAddUrl} />}>
        <div className={styles.urls}>
          {parameters?.urls?.map((url, index) => {
            return (
              <div key={index} className={styles.url}>
                <Text>{url}</Text>
                <TooltipPopup
                  className={styles.icon}
                  label={formatMessage(labels.remove)}
                  position="right"
                >
                  <Icon onClick={handleRemoveUrl.bind(null, index)}>
                    <Icons.Close />
                  </Icon>
                </TooltipPopup>
              </div>
            );
          })}
        </div>
      </FormRow>
      <FormButtons>
        <SubmitButton variant="primary" disabled={queryDisabled} loading={isRunning}>
          {formatMessage(labels.runQuery)}
        </SubmitButton>
      </FormButtons>
    </Form>
  );
}

function AddUrlButton({ onAdd }) {
  const { formatMessage, labels } = useMessages();

  return (
    <PopupTrigger>
      <TooltipPopup label={formatMessage(labels.addUrl)}>
        <Icon>
          <Icons.Plus />
        </Icon>
      </TooltipPopup>
      <Popup position="bottom" alignment="start">
        {(close, element) => {
          const { right, bottom } = element.getBoundingClientRect();

          return <UrlAddForm onSave={onAdd} onClose={close} style={{ left: right, top: bottom }} />;
        }}
      </Popup>
    </PopupTrigger>
  );
}

export default FunnelParameters;
