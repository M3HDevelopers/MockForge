import type { IconDef, IconBg } from './types';
import { rgba } from './templates';

/* =========================================================================
   ICON SYSTEM — curated filled-path icon set (24×24 viewBox) rendered via
   Path2D on canvas and inline SVG in the library UI. A proper library
   architecture: add icons to ICONS, or import user SVG packs at runtime.
   ========================================================================= */

const I = (id: string, name: string, category: string, tags: string[], d: string, style: IconDef['style'] = 'filled'): IconDef =>
  ({ id, name, category, tags, d, style });

export const ICONS: IconDef[] = [
  /* ---- development ---- */
  I('code', 'Code', 'development', ['code', 'html', 'programming', 'frontend', 'web'], 'M9 6 3 12l6 6 1.5-1.5L6 12l4.5-4.5L9 6Zm6 0-1.5 1.5L18 12l-4.5 4.5L15 18l6-6-6-6Z'),
  I('terminal', 'Terminal', 'development', ['terminal', 'console', 'cli', 'developer'], 'M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm2.6 5 3 3-3 3 1.4 1.4L12.4 12 8 7.6 6.6 9ZM13 16h5v-2h-5v2Z'),
  I('branch', 'Git Branch', 'development', ['git', 'branch', 'version', 'commit'], 'M7 5a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm0 10a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm10-8a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM8 8.7V15a3 3 0 0 0 3 3h1.3A4.7 4.7 0 0 0 17 13.3V8.7'),
  I('bug', 'Bug', 'development', ['bug', 'debug', 'error', 'test'], 'M12 4a4 4 0 0 1 4 4v1h2v2h-2v2h2v2h-2v1a4 4 0 0 1-8 0v-1H6v-2h2v-2H6V9h2V8a4 4 0 0 1 4-4ZM10 2l1.5 1.5L13 2l1 1-1.6 1.6A5 5 0 0 0 12 4.5c-.1 0-.3 0-.4.1L10 3l0-1Z'),
  I('package', 'Package', 'development', ['package', 'npm', 'module', 'box'], 'M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 2.2 6.6 3.7L12 11.6 5.4 7.9 12 4.2ZM5 9.6l6 3.3v6.9l-6-3.3V9.6Zm14 0v6.9l-6 3.3v-6.9l6-3.3Z'),
  I('api', 'API', 'development', ['api', 'rest', 'graphql', 'endpoint', 'backend'], 'M4 6h6v2H6v8h4v2H4V6Zm16 0v12h-6v-2h4V8h-4V6h6ZM9 11h6v2H9v-2Z'),
  I('braces', 'Function', 'development', ['function', 'braces', 'js', 'code'], 'M8 4H6a2 2 0 0 0-2 2v3a2 2 0 0 1-1 2 2 2 0 0 1 1 2v3a2 2 0 0 0 2 2h2v-2H6v-4a3 3 0 0 0-1-1 3 3 0 0 0 1-1V6h2V4Zm8 0h2a2 2 0 0 1 2 2v3a2 2 0 0 0 1 2 2 2 0 0 0-1 2v3a2 2 0 0 1-2 2h-2v-2h2v-4a3 3 0 0 1 1-1 3 3 0 0 1-1-1V6h-2V4Z'),
  I('component', 'Component', 'development', ['component', 'react', 'ui', 'frontend'], 'M12 2 3 7l9 5 9-5-9-5ZM3 12l9 5 9-5-2-1.1L12 14.7 5 10.9 3 12Zm0 5 9 5 9-5-2-1.1L12 19.7 5 15.9 3 17Z'),
  I('layout', 'Layout', 'development', ['layout', 'grid', 'ui', 'responsive'], 'M3 4h18v16H3V4Zm2 2v5h6V6H5Zm8 0v5h6V6h-6ZM5 13v5h14v-5H5Z'),
  I('responsive', 'Responsive', 'development', ['responsive', 'mobile', 'desktop', 'adaptive'], 'M3 5h13v9H3V5Zm2 2v5h9V7H5Zm11 0h3v10h-3V7Zm2 2v5h1V9h-1ZM6 16v2h7v-2H6Z'),
  I('browser', 'Browser', 'web', ['browser', 'website', 'web', 'internet'], 'M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5Zm2 0v3h14V5H5Zm0 5v9h14v-9H5Zm2-3.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm3 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z'),
  I('globe', 'Globe', 'web', ['globe', 'web', 'internet', 'domain', 'www'], 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 2c1.3 1.6 2.2 4.5 2.4 8H9.6C9.8 8.5 10.7 5.6 12 4ZM7.6 12c.1-2.7.6-5.2 1.5-7A8 8 0 0 0 4.2 12h3.4Zm6.8 0h3.4a8 8 0 0 0-4.9-7c.9 1.8 1.4 4.3 1.5 7ZM9.6 14h4.8c-.2 3.5-1.1 6.4-2.4 8-1.3-1.6-2.2-4.5-2.4-8Zm-5.4-2a8 8 0 0 0 4.9 7c-.9-1.8-1.4-4.3-1.5-7H4.2Zm11.2 0c-.1 2.7-.6 5.2-1.5 7a8 8 0 0 0 4.9-7h-3.4Z'),
  I('link', 'Link', 'web', ['link', 'url', 'anchor', 'web'], 'M10.6 13.4a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.5 1.5 1.4 1.4 1.5-1.5a2 2 0 0 1 2.8 2.8l-3 3a2 2 0 0 1-2.8 0l-1.4 1.5Zm2.8-2.8a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.5-1.5-1.4-1.4-1.5 1.5a2 2 0 0 1-2.8-2.8l3-3a2 2 0 0 1 2.8 0l1.4-1.5Z'),
  /* ---- design ---- */
  I('pen', 'Pen Tool', 'design', ['pen', 'vector', 'figma', 'design', 'path'], 'M12 2 9 9l-7 3 7 3 3 7 3-7 7-3-7-3-3-7Zm0 5 1.6 3.4L17 12l-3.4 1.6L12 17l-1.6-3.4L7 12l3.4-1.6L12 7Z'),
  I('layers', 'Layers', 'design', ['layers', 'stack', 'design', 'compose'], 'M12 2 2 8l10 6 10-6-10-6ZM2 12l10 6 10-6-2-1.2L12 15.6 4 10.8 2 12Zm0 4 10 6 10-6-2-1.2L12 19.6 4 14.8 2 16Z'),
  I('grid', 'Grid', 'design', ['grid', 'layout', 'design', 'modular'], 'M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z'),
  I('type', 'Typography', 'design', ['typography', 'font', 'text', 'type'], 'M5 5v3h2V7h4v10H9v2h6v-2h-2V7h4v1h2V5H5Z'),
  I('color', 'Color', 'design', ['color', 'palette', 'swatch', 'design'], 'M12 3a9 9 0 0 0 0 18c1 0 1.8-.8 1.8-1.8 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-1 .8-1.8 1.8-1.8H17a4 4 0 0 0 4-4c0-4.4-4-8-9-8ZM7.5 12a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm3-4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm3 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z'),
  I('frame', 'Frame', 'design', ['frame', 'artboard', 'figma', 'canvas'], 'M9 3v6H3v6h6v6h6v-6h6V9h-6V3H9Zm2 2h2v4h4v2h-4v4h-2v-4H7V9h4V5Z'),
  I('image', 'Image', 'design', ['image', 'photo', 'picture', 'asset'], 'M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm1 2v9.6l4-4 3 3 4.5-4.5L19 16V6H5Zm3.5 2A1.5 1.5 0 1 1 7 9.5 1.5 1.5 0 0 1 8.5 8Z'),
  I('prototype', 'Prototype', 'design', ['prototype', 'flow', 'wireframe', 'ux'], 'M5 4h6v6H5V4Zm8 0h6v6h-6V4ZM5 14h6v6H5v-6Zm11 0 4 3-4 3v-6Z'),
  /* ---- ai / ml ---- */
  I('neural', 'Neural Net', 'ai', ['ai', 'neural', 'network', 'ml', 'deep learning', 'nodes'], 'M6 6a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm12 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM6 14a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm12 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm-6-6a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM8 8.8l2.3 1.4M16 8.8l-2.3 1.4M8 15.2l2.3-1.4M16 15.2l-2.3-1.4M8 10v4M16 10v4', 'outline'),
  I('robot', 'Robot', 'ai', ['robot', 'automation', 'bot', 'robotics'], 'M12 2a1.5 1.5 0 0 1 1.5 1.5c0 .5-.3 1-.7 1.3V6H17a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3h4.2V4.8c-.4-.3-.7-.8-.7-1.3A1.5 1.5 0 0 1 12 2ZM7 8a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H7Zm2 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm-5 5h4v1.5h-4V16Z'),
  I('chip', 'Chip', 'ai', ['chip', 'cpu', 'processor', 'hardware', 'ai'], 'M9 3v2H7a2 2 0 0 0-2 2v2H3v2h2v2H3v2h2v2a2 2 0 0 0 2 2h2v2h2v-2h2v2h2v-2h2a2 2 0 0 0 2-2v-2h2v-2h-2v-2h2V9h-2V7a2 2 0 0 0-2-2h-2V3h-2v2h-2V3H9Zm-2 4h10v10H7V7Zm2 2v6h6V9H9Z'),
  I('spark', 'Prediction', 'ai', ['prediction', 'spark', 'insight', 'ai', 'magic'], 'M12 2c.6 4 2 7 4 8.5 1.5 1.2 3.8 1.5 6 1.5-2.2.3-4.5.9-6 2.3-2 1.6-3.4 4.7-4 7.7-.6-3-2-6.1-4-7.7-1.5-1.4-3.8-2-6-2.3 2.2 0 4.5-.3 6-1.5C10 9 11.4 6 12 2Z'),
  I('dataset', 'Dataset', 'ai', ['dataset', 'data', 'table', 'ml', 'training'], 'M4 4h16v3H4V4Zm0 5h7v11H4V9Zm9 0h7v5h-7V9Zm0 7h7v4h-7v-4Z'),
  I('model', 'Model', 'ai', ['model', 'cube', 'ml', '3d', 'object'], 'M12 2 4 6.5v11L12 22l8-4.5v-11L12 2Zm0 2.3 5.5 3.1L12 10.5 6.5 7.4 12 4.3ZM6 9.2l5 2.8v7.6l-5-2.8V9.2Zm12 0v7.6l-5 2.8V12l5-2.8Z'),
  /* ---- cloud / devops ---- */
  I('cloud', 'Cloud', 'cloud', ['cloud', 'aws', 'hosting', 'storage', 'saas'], 'M7 18a5 5 0 0 1-.9-9.9A6 6 0 0 1 17.8 9 4.5 4.5 0 0 1 17 18H7Z'),
  I('server', 'Server', 'cloud', ['server', 'backend', 'hosting', 'infrastructure'], 'M4 4h16a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm0 10h16a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1Zm2-7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm0 10a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z'),
  I('container', 'Container', 'cloud', ['container', 'docker', 'devops', 'deploy'], 'M3 10h3v3H3v-3Zm4 0h3v3H7v-3Zm4 0h3v3h-3v-3Zm-8-4h3v3H3V6Zm4 0h3v3H7V6Zm4 0h3v3h-3V6Zm8 5.5c2 0 3.5.8 4 2-.8.5-2 .7-3 .4-1.5 2.6-4.5 4.1-8.5 4.1-3.5 0-6.5-1.5-8-4l1.7-1c.3.4.6.7 1 .9V11h3v3h3v-3h3v3h2.8c.4-1 .3-2-.2-2.5.4-.6 1-1 1.2-1Z'),
  I('deploy', 'Deploy', 'cloud', ['deploy', 'rocket', 'launch', 'cicd', 'release'], 'M12 2c3 1.5 5 5 5 9l3 4-4-1c-.6 1.4-1.6 2.6-2.8 3.4L12 22l-1.2-4.6C9.6 16.6 8.6 15.4 8 14l-4 1 3-4c0-4 2-7.5 5-9Zm0 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z'),
  I('monitor', 'Monitoring', 'cloud', ['monitoring', 'metrics', 'observability', 'dashboard'], 'M3 4h18v12H3V4Zm2 2v8h14V6H5Zm4 6 2-3 2 2 2-4 1.5 5H9ZM9 19h6v2H9v-2Z'),
  I('infinity', 'CI/CD', 'cloud', ['cicd', 'pipeline', 'automation', 'loop', 'devops'], 'M7 8.5A3.5 3.5 0 0 0 7 15.5c1.2 0 2.2-.6 3.2-1.6L12 12l-1.8-1.9C9.2 9.1 8.2 8.5 7 8.5Zm10 0c-1.2 0-2.2.6-3.2 1.6L12 12l1.8 1.9c1 1 2 1.6 3.2 1.6a3.5 3.5 0 0 0 0-7Z', 'outline'),
  I('network', 'Network', 'cloud', ['network', 'nodes', 'topology', 'microservice'], 'M12 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM5 15a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm14 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM12 8v4m0 0-5.5 4M12 12l5.5 4', 'outline'),
  /* ---- database ---- */
  I('database', 'Database', 'database', ['database', 'sql', 'storage', 'db'], 'M12 2c4.4 0 8 1.3 8 3v14c0 1.7-3.6 3-8 3s-8-1.3-8-3V5c0-1.7 3.6-3 8-3Zm6 5c0 .6-2.7 2-6 2s-6-1.4-6-2v2c0 1.7 3.6 3 6 3s6-1.3 6-3V7Zm0 6c0 .6-2.7 2-6 2s-6-1.4-6-2v2c0 1.7 3.6 3 6 3s6-1.3 6-3v-2Z'),
  I('table', 'Table', 'database', ['table', 'sql', 'rows', 'collection'], 'M3 4h18v16H3V4Zm2 4v3h6V8H5Zm8 0v3h6V8h-6ZM5 13v3h6v-3H5Zm8 0v3h6v-3h-6Z'),
  I('query', 'Query', 'database', ['query', 'search', 'filter', 'sql'], 'M10 3a7 7 0 1 0 4.2 12.6l4.6 4.6 1.4-1.4-4.6-4.6A7 7 0 0 0 10 3Zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z'),
  I('storage', 'Storage', 'database', ['storage', 'cloud database', 'disk', 'archive'], 'M4 6a8 3 0 0 1 16 0v12a8 3 0 0 1-16 0V6Zm8-1c-3.3 0-6 .9-6 1s2.7 1 6 1 6-.9 6-1-2.7-1-6-1Zm-6 5c0 .1 2.7 1 6 1s6-.9 6-1v3c0 .1-2.7 1-6 1s-6-.9-6-1v-3Zm0 5c0 .1 2.7 1 6 1s6-.9 6-1v3c0 .1-2.7 1-6 1s-6-.9-6-1v-3Z', 'outline'),
  /* ---- mobile ---- */
  I('smartphone', 'Smartphone', 'mobile', ['mobile', 'phone', 'app', 'ios', 'android'], 'M7 2h10a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Zm1 2v14h8V4H8Zm2 15h4v1.5h-4V19Z'),
  I('tablet', 'Tablet', 'mobile', ['tablet', 'ipad', 'device'], 'M5 3h14a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm1 2v13h12V5H6Zm5 14h2v1.5h-2V19Z'),
  I('bell', 'Notification', 'mobile', ['notification', 'alert', 'bell', 'push'], 'M12 2a2 2 0 0 1 2 2c3 .9 5 3.6 5 7v4l2 3H3l2-3v-4c0-3.4 2-6.1 5-7a2 2 0 0 1 2-2Zm-2 17h4a2 2 0 0 1-4 0Z'),
  I('touch', 'Touch', 'mobile', ['touch', 'gesture', 'tap', 'interaction'], 'M12 2a3 3 0 0 1 3 3v6.3l3.6.9a3 3 0 0 1 2.2 3.6l-1 4A3 3 0 0 1 16.9 22H10a3 3 0 0 1-2.4-1.2L4 16l1.6-1.2a3 3 0 0 1 3.4-.2L10 15.3V5a3 3 0 0 1 2-3ZM8 8a4 4 0 0 1 8 0', 'outline'),
  I('camera', 'Camera', 'mobile', ['camera', 'photo', 'capture', 'mobile'], 'M9 4l-1.5 2H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-3.5L15 4H9Zm3 4a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z'),
  I('gps', 'GPS', 'mobile', ['gps', 'location', 'map', 'pin'], 'M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7Zm0 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z'),
  /* ---- security ---- */
  I('lock', 'Lock', 'security', ['lock', 'security', 'password', 'auth'], 'M12 2a5 5 0 0 1 5 5v3h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h1V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v3h6V7a3 3 0 0 0-3-3Zm0 9a2 2 0 0 0-1 3.7V19h2v-2.3A2 2 0 0 0 12 13Z'),
  I('shield', 'Shield', 'security', ['shield', 'protection', 'secure', 'firewall'], 'M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3Zm-1 13.6L7.5 12l1.4-1.4 2.1 2.1 4.1-4.1 1.4 1.4-5.5 5.6Z'),
  I('key', 'Key', 'security', ['key', 'auth', 'token', 'access'], 'M15 2a6 6 0 0 1 4.9 9.5L22 13.6 20.6 15l-1.4-1.4-1.4 1.4 1.4 1.4-1.4 1.4-1.4-1.4-2.1 2.1A6 6 0 1 1 15 2Zm0 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z'),
  I('fingerprint', 'Fingerprint', 'security', ['fingerprint', 'biometric', 'auth', 'identity'], 'M12 3a8 8 0 0 1 8 8c0 2-.3 4-1 6M12 3a8 8 0 0 0-8 8c0 1.5.2 3 .5 4.5M12 6.5A4.5 4.5 0 0 1 16.5 11c0 2.5-.5 5-1.5 7M12 6.5A4.5 4.5 0 0 0 7.5 11c0 2 .3 4 1 5.5M12 10a1 1 0 0 1 1 1c0 2.5-.5 5-1.5 7', 'outline'),
  /* ---- e-commerce ---- */
  I('cart', 'Cart', 'ecommerce', ['cart', 'shopping', 'checkout', 'buy', 'store'], 'M3 4h2.5l1 2H20l-2.2 8H7.6L5 6H3V4Zm5 14a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm9 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z'),
  I('store', 'Store', 'ecommerce', ['store', 'shop', 'merchant', 'storefront'], 'M4 3h16l1 5a3 3 0 0 1-3 3 3 3 0 0 1-2.5-1.3A3 3 0 0 1 13 11a3 3 0 0 1-2.5-1.3A3 3 0 0 1 8 11a3 3 0 0 1-3-3l-1-5Zm2 10.8V21h5v-6h2v6h5v-7.2a5 5 0 0 1-2-.8 5 5 0 0 1-4 .8 5 5 0 0 1-4-.8 5 5 0 0 1-2 .8Z'),
  I('payment', 'Payment', 'ecommerce', ['payment', 'card', 'credit', 'checkout', 'money'], 'M3 6h18a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Zm-1 3v2h20V9H2Zm3 6h6v2H5v-2Z'),
  I('delivery', 'Delivery', 'ecommerce', ['delivery', 'truck', 'shipping', 'logistics'], 'M2 6h12v10H2V6Zm12 3h4l3 3v4h-2a2.5 2.5 0 0 1-5 0h-0V9ZM6.5 16a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm10 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z'),
  I('tag', 'Tag', 'ecommerce', ['tag', 'price', 'label', 'product', 'discount'], 'M3 3h8l10 10-8 8L3 11V3Zm4 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z'),
  I('order', 'Order', 'ecommerce', ['order', 'receipt', 'invoice', 'purchase'], 'M6 2h12v20l-2-1.5L14 22l-2-1.5L10 22l-2-1.5L6 22V2Zm3 5h6v2H9V7Zm0 4h6v2H9v-2Zm0 4h4v2H9v-2Z'),
  /* ---- business / analytics ---- */
  I('chart', 'Chart', 'business', ['chart', 'analytics', 'graph', 'data', 'dashboard'], 'M4 4h2v14h14v2H4V4Zm4 9h2v4H8v-4Zm4-4h2v8h-2V9Zm4-3h2v11h-2V6Z'),
  I('growth', 'Growth', 'business', ['growth', 'trending', 'analytics', 'increase', 'kpi'], 'M3 17l6-6 4 4 7-8 1.5 1.3L13 17.5l-4-4-4.5 4.5L3 17Zm14-9h4v4h-2v-.6L15.6 14l-1.4-1.4L17.4 9H17V8Z'),
  I('users', 'Users', 'business', ['users', 'team', 'people', 'customers', 'community'], 'M9 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 10c3.3 0 8 1.7 8 5v1H1v-1c0-3.3 4.7-5 8-5Zm8-9a3.5 3.5 0 1 1 0 7c-.4 0-.8 0-1.2-.2A6 6 0 0 0 17 8c0-1.4-.4-2.6-1.2-3.7.4.4 1 .7 1.2.7Z'),
  I('target', 'Target', 'business', ['target', 'goal', 'focus', 'objective'], 'M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm0 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm0 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z'),
  I('calendar', 'Calendar', 'business', ['calendar', 'schedule', 'date', 'planning'], 'M5 4h2V2h2v2h6V2h2v2h2a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm0 5v11h14V9H5Zm3 3h3v3H8v-3Z'),
  I('document', 'Document', 'business', ['document', 'file', 'report', 'paper'], 'M6 2h8l4 4v16H6V2Zm7 1.5V8h4.5L13 3.5ZM8 12h8v2H8v-2Zm0 4h8v2H8v-2Z'),
  I('dashboard', 'Dashboard', 'business', ['dashboard', 'overview', 'metrics', 'admin'], 'M3 3h8v10H3V3Zm10 0h8v6h-8V3ZM3 15h8v6H3v-6Zm10-4h8v10h-8V11Z'),
  I('money', 'Finance', 'business', ['finance', 'money', 'revenue', 'dollar', 'payment'], 'M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm1 4h-2v1.3c-1.8.3-3 1.4-3 3 0 1.8 1.4 2.6 3 3v3.4c-.9-.2-1.6-.8-1.8-1.7H7.1c.2 1.9 1.7 3 3.9 3.3V20h2v-1.3c1.9-.3 3.1-1.5 3.1-3.1 0-1.9-1.4-2.7-3.1-3.1V9.1c.8.2 1.4.7 1.6 1.5h2.1c-.2-1.8-1.6-2.9-3.7-3.2V6Zm-2 5.4c-.8-.3-1.2-.7-1.2-1.2 0-.6.5-1 1.2-1.2v2.4Zm2 4.9c.9.3 1.3.8 1.3 1.4 0 .6-.5 1.1-1.3 1.3v-2.7Z'),
  /* ---- robotics ---- */
  I('robotarm', 'Robot Arm', 'robotics', ['robot', 'arm', 'automation', 'industrial', 'manufacturing'], 'M4 20h8v2H2v-4h2v2Zm6-2 3-6-2-2 4-6 3 2-3 5 2 2-4 7-3-2Zm6-13a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z', 'outline'),
  I('drone', 'Drone', 'robotics', ['drone', 'uav', 'flight', 'robotics'], 'M5 5a3 3 0 1 1 3 3L10.5 10l3-3L16 9.5 18.5 7a3 3 0 1 1 1.4 1.4L17 11l1 1-2 2-1-1-2.5 2.5a3 3 0 1 1-1.4-1.4L13.5 12l-1-1 2-2 1 1L18 7.5A3 3 0 0 1 16.6 6L14 8.5l-1-1-2 2 1 1L9.5 13A3 3 0 1 1 5 5Zm7 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z'),
  I('gear', 'Automation', 'robotics', ['gear', 'automation', 'settings', 'machine', 'process'], 'M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm9 4a7.8 7.8 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a8 8 0 0 0-2-1.2L16 3h-4l-.4 2.6a8 8 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6A8 8 0 0 0 7 12c0 .4 0 .8.1 1.2l-2 1.6 2 3.4 2.4-1a8 8 0 0 0 2 1.2L12 21h4l.4-2.6a8 8 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.2-.8.2-1.2Z'),
  I('sensor', 'Sensor', 'robotics', ['sensor', 'iot', 'signal', 'detect', 'device'], 'M12 14a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0-4a7 7 0 0 1 7 7h-2a5 5 0 0 0-10 0H5a7 7 0 0 1 7-7Zm0-4a11 11 0 0 1 11 11h-2a9 9 0 0 0-18 0H1a11 11 0 0 1 11-11Z'),
];

export const ICON_CATEGORIES = ['all', 'development', 'web', 'design', 'ai', 'cloud', 'database', 'mobile', 'security', 'ecommerce', 'business', 'robotics'];
export const ICON_STYLES: IconDef['style'][] = ['filled', 'outline', 'duotone', 'bold'];

/* project type → compatible icon ids (for smart clusters, req #33) */
export const TYPE_TO_ICONS: Record<string, string[]> = {
  'E-commerce': ['cart', 'store', 'payment', 'delivery', 'tag', 'order', 'chart', 'money'],
  'Web App': ['code', 'browser', 'component', 'api', 'database', 'cloud', 'responsive', 'dashboard'],
  'Website': ['browser', 'globe', 'link', 'responsive', 'layout', 'image', 'type'],
  'Mobile App': ['smartphone', 'tablet', 'bell', 'touch', 'camera', 'gps', 'component'],
  'Dashboard': ['dashboard', 'chart', 'growth', 'monitor', 'database', 'calendar', 'target'],
  'Landing Page': ['browser', 'spark', 'growth', 'image', 'type', 'link'],
  'Portfolio': ['image', 'frame', 'pen', 'layers', 'grid', 'type', 'globe'],
  'Desktop App': ['monitor', 'code', 'package', 'terminal', 'layout'],
  'Custom': ['code', 'spark', 'component', 'cloud', 'database'],
};
export function iconsForType(type: string): IconDef[] {
  const ids = TYPE_TO_ICONS[type] || TYPE_TO_ICONS['Custom'];
  return ids.map(id => ICONS.find(i => i.id === id)!).filter(Boolean);
}

/* ---------------- inline SVG for library UI ---------------- */
export function IconSvg({ def, size = 20, color = 'currentColor' }: { def: IconDef; size?: number; color?: string }) {
  const outline = def.style === 'outline';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path
        d={def.d}
        fill={outline ? 'none' : color}
        stroke={outline ? color : 'none'}
        strokeWidth={outline ? 1.6 : 0}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---------------- canvas rendering via Path2D ---------------- */
const p2dCache = new Map<string, Path2D>();
function p2d(d: string): Path2D {
  let hit = p2dCache.get(d);
  if (!hit) { hit = new Path2D(d); p2dCache.set(d, hit); }
  return hit;
}

export function drawIconOnCanvas(
  ctx: CanvasRenderingContext2D, def: IconDef,
  cx: number, cy: number, size: number,
  color: string, bg: IconBg, bgFill: string, opacity: number, rotation: number,
) {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.translate(cx, cy);
  ctx.rotate((rotation * Math.PI) / 180);
  const r = size / 2;

  /* background container */
  if (bg !== 'none') {
    if (bg === 'circle' || bg === 'orb') {
      if (bg === 'orb') {
        const g = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
        g.addColorStop(0, bgFill); g.addColorStop(1, rgba(bgFill, 0.7));
        ctx.fillStyle = g;
      } else ctx.fillStyle = bgFill;
      ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
    } else if (bg === 'round' || bg === 'badge') {
      ctx.fillStyle = bgFill;
      ctx.beginPath(); ctx.roundRect(-r, -r, size, size, bg === 'badge' ? r * 0.4 : r * 0.28); ctx.fill();
    } else if (bg === 'glass') {
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.roundRect(-r, -r, size, size, r * 0.28); ctx.fill(); ctx.stroke();
    }
  }

  /* icon glyph (70% of container) */
  const gs = size * 0.62;
  ctx.translate(-gs / 2, -gs / 2);
  ctx.scale(gs / 24, gs / 24);
  const path = p2d(def.d);
  if (def.style === 'outline') {
    ctx.strokeStyle = color; ctx.lineWidth = 1.7; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.stroke(path);
  } else {
    ctx.fillStyle = color;
    ctx.fill(path);
  }
  ctx.restore();
}
