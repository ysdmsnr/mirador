import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import Paper from '@material-ui/core/Paper';
import { MosaicWindowContext } from 'react-mosaic-component/lib/contextTypes';
import ns from '../config/css-ns';
import WindowTopBar from '../containers/WindowTopBar';
import PrimaryWindow from '../containers/PrimaryWindow';
import CompanionArea from '../containers/CompanionArea';
import MinimalWindow from '../containers/MinimalWindow';
import ErrorContent from '../containers/ErrorContent';
import IIIFAuthentication from '../containers/IIIFAuthentication';
import { PluginHook } from './PluginHook';

/**
 * Represents a Window in the mirador workspace
 * @param {object} window
 */
export class Window extends Component {
  /** */
  constructor(props) {
    super(props);
    this.state = {};
  }

  /** */
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { error, hasError: true };
  }

  /**
   * wrappedTopBar - will conditionally wrap a WindowTopBar for needed
   * additional functionality based on workspace type
   */
  wrappedTopBar() {
    const {
      windowId, workspaceType, windowDraggable,
    } = this.props;

    const topBar = (
      <div>
        <WindowTopBar
          windowId={windowId}
          windowDraggable={windowDraggable}
        />
        <IIIFAuthentication windowId={windowId} />
      </div>
    );
    if (workspaceType === 'mosaic' && windowDraggable) {
      const { mosaicWindowActions } = this.context;
      return mosaicWindowActions.connectDragSource(
        topBar,
      );
    }
    return topBar;
  }

  /**
   * Renders things
   */
  render() {
    const {
      focusWindow, label, isFetching, maximized, sideBarOpen,
      view, windowId, classes, t,
      manifestError,
    } = this.props;

    const { error, hasError } = this.state;

    if (hasError) {
      return (
        <MinimalWindow windowId={windowId}>
          <ErrorContent error={error} windowId={windowId} />
        </MinimalWindow>
      );
    }

    return (
      <Paper
        onFocus={focusWindow}
        component="section"
        elevation={1}
        id={windowId}
        className={
          cn(
            classes.window,
            ns('window'),
            maximized ? classes.maximized : null,
          )
}
        aria-label={t('window', { label })}
      >
        {this.wrappedTopBar()}
        { manifestError && <ErrorContent error={{ stack: manifestError }} windowId={windowId} /> }
        <div className={classes.middle}>
          <div className={classes.middleLeft}>
            <div className={classes.primaryWindow}>
              <PrimaryWindow
                view={view}
                windowId={windowId}
                isFetching={isFetching}
                sideBarOpen={sideBarOpen}
              />
            </div>
            <div className={classes.companionAreaBottom}>
              <CompanionArea windowId={windowId} position="bottom" />
            </div>
          </div>
          <div className={classes.companionAreaRight}>
            <CompanionArea windowId={windowId} position="right" />
            <CompanionArea windowId={windowId} position="far-right" />
          </div>
        </div>
        <CompanionArea windowId={windowId} position="far-bottom" />
        <PluginHook {...this.props} />
      </Paper>
    );
  }
}

Window.contextType = MosaicWindowContext;

Window.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string),
  focusWindow: PropTypes.func,
  isFetching: PropTypes.bool,
  label: PropTypes.string,
  manifestError: PropTypes.string,
  maximized: PropTypes.bool,
  sideBarOpen: PropTypes.bool,
  t: PropTypes.func.isRequired,
  view: PropTypes.string,
  windowDraggable: PropTypes.bool,
  windowId: PropTypes.string.isRequired,
  workspaceType: PropTypes.string,
};

Window.defaultProps = {
  classes: {},
  focusWindow: () => {},
  isFetching: false,
  label: null,
  manifestError: null,
  maximized: false,
  sideBarOpen: false,
  view: undefined,
  windowDraggable: null,
  workspaceType: null,
};
