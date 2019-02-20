/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const SplashContainer = props => (
  <div className="homeContainer">
    <div className="homeSplashFade">
      <div className="wrapper homeWrapper">{props.children}</div>
    </div>
  </div>
);

const ProjectTitle = ({ baseUrl, siteConfig }) => (
  <div>
    <h1
      className="projectTitle"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <img
        src={`${baseUrl}img/logo.svg`}
        alt="Project Logo"
        width="75"
        height="75"
        style={{
          marginRight: 15,
        }}
      />
      {siteConfig.title}
    </h1>
    <h2 style={{ marginTop: '0.5em' }}>{siteConfig.tagline}</h2>
  </div>
);

const PromoSection = props => (
  <div className="section promoSection">
    <div className="promoRow">
      <div className="pluginRowBlock">{props.children}</div>
    </div>
  </div>
);

const Button = props => (
  <div className="pluginWrapper buttonWrapper">
    <a className="button hero" href={props.href} target={props.target}>
      {props.children}
    </a>
  </div>
);

class HomeSplash extends React.Component {
  render() {
    const { siteConfig, language = '' } = this.props;
    const { baseUrl, docsUrl } = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

    return (
      <SplashContainer>
        <div className="inner">
          <ProjectTitle baseUrl={baseUrl} siteConfig={siteConfig} />
          <PromoSection>
            <Button href={docUrl('introduction/quick-start')}>
              GET STARTED
            </Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

const Features = ({ baseUrl }) => (
  <Block layout="fourColumn" background="light">
    {[
      {
        content:
          'Only minimal type annotations are required, all types are inferred where possible.',
        image: `${baseUrl}img/dev/003-bug.svg`,
        imageAlign: 'top',
        title: 'Designed for Typescript',
      },
      {
        content:
          'Simple and developer friendly syntax with React hooks.  \nNo more higher-order components, decorators or classes.',
        image: `${baseUrl}img/dev/010-dynamic.svg`,
        imageAlign: 'top',
        title: 'Modern React',
      },
      {
        content: 'Dispatch and react on actions.  \nBased on Redux and RxJS.',
        image: `${baseUrl}img/dev/018-launch.svg`,
        imageAlign: 'top',
        title: 'Event-driven architecture',
      },
      {
        content: 'Code splitting for reducers and epics work out of the box.',
        image: `${baseUrl}img/dev/001-analysis.svg`,
        imageAlign: 'top',
        title: 'Scalable',
      },
      {
        content:
          'All basic building blocks are provided: **actions**, **epics**, **reducers**, **selectors**.  \nNo need to combine multiple small libraries.',
        image: `${baseUrl}img/dev/008-developer.svg`,
        imageAlign: 'top',
        title: 'Complete toolkit',
      },
    ]}
  </Block>
);

const FeatureCallout = () => (
  <div
    className="productShowcaseSection paddingBottom"
    style={{ textAlign: 'center' }}
  >
    <h2>Feature Callout</h2>
    <MarkdownBlock>These are features of this project</MarkdownBlock>
  </div>
);

const Block = props => (
  <Container
    padding={['bottom', 'top']}
    id={props.id}
    background={props.background}
  >
    <GridBlock align="center" contents={props.children} layout={props.layout} />
  </Container>
);

class Index extends React.Component {
  render() {
    const { config: siteConfig, language = '' } = this.props;
    const { baseUrl } = siteConfig;

    return (
      <div>
        <HomeSplash siteConfig={siteConfig} language={language} />
        <div className="mainContainer" style={{ paddingBottom: 0 }}>
          <Features baseUrl={baseUrl} />
        </div>
      </div>
    );
  }
}

module.exports = Index;
