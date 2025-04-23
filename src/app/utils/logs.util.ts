import { Experiment, ExperimentLog } from "@/app/types";

export function* generateLogs(experiment: Experiment): Generator<ExperimentLog> {
  if (!experiment || !experiment.liveUpdates) return;

  const sortedUpdates = [...experiment.liveUpdates].sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  for (const update of sortedUpdates) {
    yield {
      timestamp: update.timestamp,
      experimentId: experiment.experimentId,
      message: `${update.control.visitors} new visitors in Control group`,
      eventType: 'visitor',
    };

    yield {
      timestamp: update.timestamp,
      experimentId: experiment.experimentId,
      message: `${update.variantB.visitors} new visitors in Variant B group`,
      eventType: 'visitor',
    };

    if (update.control.conversions > 0) {
      yield {
        timestamp: update.timestamp,
        experimentId: experiment.experimentId,
        message: `${update.control.conversions} new conversions in Control group`,
        eventType: 'conversion',
      };
    }

    if (update.variantB.conversions > 0) {
      yield {
        timestamp: update.timestamp,
        experimentId: experiment.experimentId,
        message: `${update.variantB.conversions} new conversions in Variant B group`,
        eventType: 'conversion',
      };
    }

    if (update.control.revenue > 0) {
      yield {
        timestamp: update.timestamp,
        experimentId: experiment.experimentId,
        message: `$${update.control.revenue} new revenue in Control group`,
        eventType: 'revenue',
      };
    }

    if (update.variantB.revenue > 0) {
      yield {
        timestamp: update.timestamp,
        experimentId: experiment.experimentId,
        message: `$${update.variantB.revenue} new revenue in Variant B group`,
        eventType: 'revenue',
      };
    }
  }
}
