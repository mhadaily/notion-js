import { Action } from "../types/actions";

type OAuthClaims = {
  oauth?: true;
  authId?: string;
  scopes?: string;
};

const scopeRequiredByMetric = {
  accelerometer: "read:accelerometer",
  brainwaves: "read:brainwaves",
  "awareness/calm": "read:calm",
  "awareness/focus": "read:focus",
  kinesis: "read:kinesis",
  predictions: "read:kinesis",
  signalQuality: "read:signal-quality"
};

const scopeRequiredByAction = {
  "marker/add": "write:brainwave-markers",
  "brainwaves/record": "write:brainwaves",
  "haptics/queue": "write:haptics",
  "training/record": "write:kinesis",
  "training/stop": "write:kinesis",
  "training/stopAll": "write:kinesis",
  "wifi/reset": "write:wifi-settings"
};

const scopeRequiredByFunctionName = {
  // device info
  getInfo: "read:devices-info",
  getSelectedDevice: "read:devices-info",
  selectDevice: "read:devices-info",
  onDeviceChange: "read:devices-info",
  onUserDevicesChange: "read:devices-info",
  // end device info
  settings: "read:devices-settings",
  changeSettings: "write:devices-settings",
  status: "read:devices-status"
};

export function validateOAuthScopeForMetric(
  userClaims: OAuthClaims,
  metric: string,
  labels: string[],
  atomic: boolean
): [boolean, Error | null] {
  const { oauth, scopes: scopesString } = userClaims ?? {};

  if (!oauth) {
    return [false, null];
  }

  const scopes = scopesString.split(",");

  const requiredScopes = atomic
    ? labels.map((label) => scopeRequiredByMetric[`${metric}/${label}`])
    : [scopeRequiredByMetric[metric]];

  const hasRequireScopes = requiredScopes.every((scope) =>
    scopes.includes(scope)
  );

  if (hasRequireScopes) {
    return [false, null];
  }

  return [true, getScopeError(...requiredScopes)];
}

export function validateOAuthScopeForAction(
  userClaims: OAuthClaims,
  action: Action
): [boolean, Error | null] {
  const { oauth, scopes: scopesString } = userClaims ?? {};

  if (!oauth) {
    return [false, null];
  }

  const scopes = scopesString.split(",");

  const { command, action: actionName } = action;
  const requiredScope =
    scopeRequiredByAction[`${command}/${actionName}`];
  const hasRequireScopes = scopes.includes(requiredScope);

  if (hasRequireScopes) {
    return [false, null];
  }

  return [true, getScopeError(requiredScope)];
}

export function validateOAuthScopeForFunctionName(
  userClaims: OAuthClaims,
  functionName: string
): [boolean, Error | null] {
  const { oauth, scopes: scopesString } = userClaims ?? {};

  if (!oauth) {
    return [false, null];
  }

  const scopes = scopesString.split(",");

  const requiredScope = scopeRequiredByFunctionName[functionName];
  const hasRequireScopes = scopes.includes(requiredScope);

  if (hasRequireScopes) {
    return [false, null];
  }

  return [true, getScopeError(requiredScope)];
}

function getScopeError(...requiredScopes: string[]): Error {
  return new Error(
    `You are trying to access data with an OAuth token without access to the following scopes: ${requiredScopes.join(
      ", "
    )}.`
  );
}
