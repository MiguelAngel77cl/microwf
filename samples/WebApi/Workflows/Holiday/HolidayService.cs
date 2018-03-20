using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using tomware.Microwf.AspNetCore;
using tomware.Microwf.Core;
using WebApi.Domain;

namespace WebApi.Workflows.Holiday
{
  public interface IHolidayService
  {
    Task<IWorkflowResult<HolidayViewModel>> GetAsync(int id);

    Task<IWorkflowResult<HolidayViewModel>> NewAsync();

    Task<IWorkflowResult<HolidayViewModel>> ApplyAsync(HolidayViewModel model);

    Task<IWorkflowResult<HolidayViewModel>> ApproveAsync(HolidayViewModel model);

    Task<IWorkflowResult<HolidayViewModel>> RejectAsync(HolidayViewModel model);

    Task<IEnumerable<AssignableWorkflowViewModel>> MyWorkAsync();
  }

  public class HolidayService : IHolidayService
  {
    private readonly DomainContext _context;
    private readonly IWorkflowEngine _workflowEngine;

    public HolidayService(DomainContext context, IWorkflowEngine workflowEngine)
    {
      _context = context;
      _workflowEngine = workflowEngine;
    }

    public async Task<IWorkflowResult<HolidayViewModel>> GetAsync(int id)
    {
      var holiday = await _context.Holidays.FindAsync(id);

      return ToResult(holiday);
    }

    public async Task<IWorkflowResult<HolidayViewModel>> NewAsync()
    {
      var holiday = Domain.Holiday.Create("Me");

      _context.Add(holiday);
      await _context.SaveChangesAsync();

      return ToResult(holiday);
    }
    
    public async Task<IWorkflowResult<HolidayViewModel>> ApplyAsync(HolidayViewModel model)
    {
      if (model == null) throw new ArgumentNullException(nameof(model));

      return await Trigger(HolidayApprovalWorkflow.APPLY_TRIGGER, model);
    }

    public async Task<IWorkflowResult<HolidayViewModel>> ApproveAsync(HolidayViewModel model)
    {
      if (model == null) throw new ArgumentNullException(nameof(model));

      return await Trigger(HolidayApprovalWorkflow.APPROVE_TRIGGER, model);
    }

    public async Task<IWorkflowResult<HolidayViewModel>> RejectAsync(HolidayViewModel model)
    {
      if (model == null) throw new ArgumentNullException(nameof(model));

      return await Trigger(HolidayApprovalWorkflow.REJECT_TRIGGER, model);
    }

    public async Task<IEnumerable<AssignableWorkflowViewModel>> MyWorkAsync()
    {
      var me = "Me";
      var work = await _context.Holidays.Where(h => h.Assignee == me).ToListAsync();

      return work.Select(h => new AssignableWorkflowViewModel
      {
        Id = h.Id,
        Assignee = h.Assignee,
        Type = h.Type,
        Description = string.Empty
      });
    }

    private IWorkflowResult<HolidayViewModel> ToResult(Domain.Holiday holiday)
    {
      IEnumerable<TriggerResult> result = _workflowEngine.GetTriggers(holiday);
      var triggers = result.Select(x => x.TriggerName);

      var viewModel = new HolidayViewModel
      {
        Id = holiday.Id,
        Requestor = holiday.Requestor,
        Superior = holiday.Superior,
        From = holiday.From,
        To = holiday.To
      };

      return new WorkflowResult<HolidayViewModel>(triggers, viewModel);
    }

    private async Task<IWorkflowResult<HolidayViewModel>> Trigger(
      string trigger,
      HolidayViewModel model
    )
    {
      var holiday = await _context.Holidays.FindAsync(model.Id);
      holiday.Superior = model.Superior;
      holiday.From = model.From;
      holiday.To = model.To;

      var triggerParam = new TriggerParam(trigger, holiday);
      _workflowEngine.Trigger(triggerParam);

      return ToResult(holiday);
    }
  }
}